export type TorrentFile = {
  path: string;
  size: number;
};

export type Torrent = {
  id: string;
  name: string;
  infoHash: string;
  files: TorrentFile[];
  totalSize: number;
  trackers: string[];
  pieceLength: number;
  createdAt: string;
};