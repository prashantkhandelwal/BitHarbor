CREATE TABLE `torrents` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`info_hash` text NOT NULL UNIQUE,
	`files` text NOT NULL,
	`total_size` integer NOT NULL,
	`trackers` text NOT NULL,
	`piece_length` integer NOT NULL,
	`created_at` text NOT NULL
);
