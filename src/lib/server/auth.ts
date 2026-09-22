import { env } from '$env/dynamic/private';
import { createHash, randomBytes, scrypt as nodeScrypt, timingSafeEqual } from 'node:crypto';
import { and, eq, isNull } from 'drizzle-orm';
import type { User } from '$lib/types';
import { redirect } from '@sveltejs/kit';
import { database } from './db';
import {
  invites as postgresInvites,
  sessions as postgresSessions,
  users as postgresUsers
} from './db/schema.postgres';
import {
  invites as sqliteInvites,
  sessions as sqliteSessions,
  users as sqliteUsers
} from './db/schema.sqlite';

export const sessionCookieName = 'bitharbor_session';
export const sessionDurationSeconds = 60 * 60 * 24 * 30;

export class InvalidInviteError extends Error {}
export class UsernameTakenError extends Error {}

export function requireUser(user: User | null, pathname: string): User {
  if (!user) redirect(303, `/login?redirect=${encodeURIComponent(pathname)}`);
  return user;
}

function hashValue(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function deriveKey(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    nodeScrypt(password, salt, 64, (error, key) => {
      if (error) reject(error);
      else resolve(Buffer.from(key));
    });
  });
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await deriveKey(password, salt);
  return `${salt.toString('hex')}:${key.toString('hex')}`;
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [saltHex, keyHex] = storedHash.split(':');
  if (!saltHex || !keyHex) return false;

  const expected = Buffer.from(keyHex, 'hex');
  const actual = await deriveKey(password, Buffer.from(saltHex, 'hex'));
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function publicUser(user: { id: string; username: string }): User {
  return { id: user.id, username: user.username };
}

export async function ensureInitialInvite(): Promise<void> {
  const inviteCode = env.INITIAL_INVITE_CODE?.trim();
  if (!inviteCode) return;

  const invite = {
    codeHash: hashValue(inviteCode),
    createdBy: null,
    usedBy: null,
    createdAt: new Date(),
    usedAt: null
  };

  if (database.type === 'sqlite') {
    database.db
      .insert(sqliteInvites)
      .values({ ...invite, createdAt: invite.createdAt.toISOString() })
      .onConflictDoNothing()
      .run();
    return;
  }

  await database.db.insert(postgresInvites).values(invite).onConflictDoNothing();
}

export async function registerUser(username: string, password: string, inviteCode: string): Promise<User> {
  const normalizedUsername = username.trim().toLowerCase();
  const passwordHash = await hashPassword(password);
  const codeHash = hashValue(inviteCode.trim());
  const id = crypto.randomUUID();

  if (database.type === 'sqlite') {
    try {
      return database.db.transaction((transaction) => {
        const invite = transaction
          .select()
          .from(sqliteInvites)
          .where(and(eq(sqliteInvites.codeHash, codeHash), isNull(sqliteInvites.usedAt)))
          .get();
        if (!invite) throw new InvalidInviteError();

        const createdAt = new Date().toISOString();
        transaction.insert(sqliteUsers).values({ id, username: normalizedUsername, passwordHash, createdAt }).run();
        transaction
          .update(sqliteInvites)
          .set({ usedBy: id, usedAt: createdAt })
          .where(eq(sqliteInvites.codeHash, codeHash))
          .run();
        return { id, username: normalizedUsername };
      });
    } catch (error) {
      if (error instanceof InvalidInviteError) throw error;
      throw new UsernameTakenError();
    }
  }

  try {
    return await database.db.transaction(async (transaction) => {
      const [invite] = await transaction
        .select()
        .from(postgresInvites)
        .where(and(eq(postgresInvites.codeHash, codeHash), isNull(postgresInvites.usedAt)))
        .for('update')
        .limit(1);
      if (!invite) throw new InvalidInviteError();

      const [user] = await transaction
        .insert(postgresUsers)
        .values({ id, username: normalizedUsername, passwordHash })
        .returning();
      await transaction
        .update(postgresInvites)
        .set({ usedBy: id, usedAt: new Date() })
        .where(eq(postgresInvites.codeHash, codeHash));
      return publicUser(user);
    });
  } catch (error) {
    if (error instanceof InvalidInviteError) throw error;
    throw new UsernameTakenError();
  }
}

export async function authenticateUser(username: string, password: string): Promise<User | null> {
  const normalizedUsername = username.trim().toLowerCase();
  const user =
    database.type === 'sqlite'
      ? database.db.select().from(sqliteUsers).where(eq(sqliteUsers.username, normalizedUsername)).get()
      : (
          await database.db
            .select()
            .from(postgresUsers)
            .where(eq(postgresUsers.username, normalizedUsername))
            .limit(1)
        )[0];

  if (!user || !(await verifyPassword(password, user.passwordHash))) return null;
  return publicUser(user);
}

export async function createSession(userId: string): Promise<string> {
  const token = randomBytes(32).toString('base64url');
  const tokenHash = hashValue(token);
  const expiresAt = new Date(Date.now() + sessionDurationSeconds * 1000);

  if (database.type === 'sqlite') {
    database.db
      .insert(sqliteSessions)
      .values({ tokenHash, userId, expiresAt: expiresAt.toISOString() })
      .run();
  } else {
    await database.db.insert(postgresSessions).values({ tokenHash, userId, expiresAt });
  }

  return token;
}

export async function validateSession(token: string): Promise<User | null> {
  const tokenHash = hashValue(token);
  const session =
    database.type === 'sqlite'
      ? database.db.select().from(sqliteSessions).where(eq(sqliteSessions.tokenHash, tokenHash)).get()
      : (
          await database.db
            .select()
            .from(postgresSessions)
            .where(eq(postgresSessions.tokenHash, tokenHash))
            .limit(1)
        )[0];

  if (!session) return null;
  const expiresAt = typeof session.expiresAt === 'string' ? new Date(session.expiresAt) : session.expiresAt;
  if (expiresAt <= new Date()) {
    await deleteSession(token);
    return null;
  }

  const user =
    database.type === 'sqlite'
      ? database.db.select().from(sqliteUsers).where(eq(sqliteUsers.id, session.userId)).get()
      : (await database.db.select().from(postgresUsers).where(eq(postgresUsers.id, session.userId)).limit(1))[0];
  return user ? publicUser(user) : null;
}

export async function deleteSession(token: string): Promise<void> {
  const tokenHash = hashValue(token);
  if (database.type === 'sqlite') {
    database.db.delete(sqliteSessions).where(eq(sqliteSessions.tokenHash, tokenHash)).run();
  } else {
    await database.db.delete(postgresSessions).where(eq(postgresSessions.tokenHash, tokenHash));
  }
}

export async function createInvite(userId: string): Promise<string> {
  const code = randomBytes(18).toString('base64url');
  const invite = { codeHash: hashValue(code), createdBy: userId, usedBy: null, createdAt: new Date(), usedAt: null };

  if (database.type === 'sqlite') {
    database.db.insert(sqliteInvites).values({ ...invite, createdAt: invite.createdAt.toISOString() }).run();
  } else {
    await database.db.insert(postgresInvites).values(invite);
  }

  return code;
}