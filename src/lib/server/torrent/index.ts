import type { Torrent } from '$lib/types';
import parseTorrent from 'parse-torrent';

export type ParsedTorrent = Omit<Torrent, 'id' | 'createdAt'>;

export interface TorrentParser {
  parse(contents: Uint8Array): Promise<ParsedTorrent>;
}

export class MetainfoTorrentParser implements TorrentParser {
  async parse(contents: Uint8Array): Promise<ParsedTorrent> {
    const torrent = await parseTorrent(contents);

    return {
      name: torrent.name,
      infoHash: torrent.infoHash,
      files: torrent.files.map((file) => ({ path: file.path, size: file.length })),
      totalSize: torrent.length,
      trackers: torrent.announce,
      pieceLength: torrent.pieceLength
    };
  }
}

export const torrentParser = new MetainfoTorrentParser();