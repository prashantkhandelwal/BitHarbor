bitharbor/
├── src/
│   ├── lib/
│   │   ├── server/
│   │   │   ├── db/
│   │   │   ├── storage/
│   │   │   └── torrent/
│   │   └── components/
│   │
│   └── routes/
│       ├── +page.svelte
│       │
│       ├── upload/
│       │   ├── +page.svelte
│       │   └── +page.server.ts
│       │
│       ├── torrents/
│       │   └── [id]/
│       │       ├── +page.svelte
│       │       └── +page.server.ts
│       │
│       ├── search/
│       │
│       └── api/
│           └── torrents/
│
├── static/
├── drizzle/
├── svelte.config.js
└── package.json