import type { Torrent } from '$lib/types';

export type ParsedTorrent = Omit<Torrent, 'id' | 'createdAt'>;

export interface TorrentParser {
  parse(contents: Uint8Array): Promise<ParsedTorrent>;
}

export class UnconfiguredTorrentParser implements TorrentParser {
  async parse(): Promise<ParsedTorrent> {
    throw new Error('A torrent metainfo parser is not configured.');
  }
}