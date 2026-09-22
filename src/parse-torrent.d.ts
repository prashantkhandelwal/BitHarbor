declare module 'parse-torrent' {
  type ParsedTorrentFile = {
    path: string;
    length: number;
  };

  type ParsedTorrent = {
    name: string;
    infoHash: string;
    files: ParsedTorrentFile[];
    length: number;
    announce: string[];
    pieceLength: number;
  };

  export default function parseTorrent(contents: Uint8Array): Promise<ParsedTorrent>;
}