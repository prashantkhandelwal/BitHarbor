export interface TorrentStorage {
  put(key: string, contents: Uint8Array): Promise<void>;
  get(key: string): Promise<Uint8Array | null>;
}

export class UnconfiguredTorrentStorage implements TorrentStorage {
  async put(): Promise<void> {
    throw new Error('Object storage is not configured.');
  }

  async get(): Promise<Uint8Array | null> {
    throw new Error('Object storage is not configured.');
  }
}