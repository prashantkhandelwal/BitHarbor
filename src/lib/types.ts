export type TorrentFile = {
  path: string;
  size: number;
};

export type Category = {
  id: string;
  name: string;
};

export type User = {
  id: string;
  username: string;
  isAdmin: boolean;
  isPremium: boolean;
};

export type Torrent = {
  id: string;
  name: string;
  infoHash: string;
  files: TorrentFile[];
  totalSize: number;
  trackers: string[];
  pieceLength: number;
  categoryId: string;
  categoryName?: string;
  tags: string[];
  description: string;
  createdAt: string;
};