# learn-node

Pure Node.js se banayi gayi **Notes CRUD API** — bina Express, bina database.
Ye ek **learning project** hai: maqsad ye samajhna hai ke Express jo cheezein
internally karta hai (routing, body parsing, status codes) woh raw Node mein
kaise hoti hain.

## Kya use ho raha hai

**Runtime par koi dependency nahi** — sirf Node ke built-in modules:

- `http` — server aur manual routing
- `fs` — JSON file mein data persist karna
- `path` — cross-platform file paths

TypeScript aur `@types/node` sirf **devDependencies** hain — chalte hue server
mein inka koi wajood nahi, `dist/` mein saada JavaScript hi jata hai.

## Folder structure

Layered structure — har layer ka aik hi kaam hai:

```
learn-node/
├── src/                        # TypeScript source
│   ├── server.ts               # HTTP server + routers ka chain
│   ├── routes/                 # Routing layer - URL/method dekh kar controller chunta hai
│   │   └── notesRoutes.ts
│   ├── controllers/            # Logic layer - actual CRUD kaam
│   │   └── notesController.ts
│   └── utils/                  # Helpers
│       └── fileHelper.ts       # JSON file read/write factory
├── dist/                       # tsc ka output (gitignored)
├── data/                       # "Database" - flat JSON files
│   └── notes.json
└── tsconfig.json
```

Layers ka order jaan-boojh kar aisa hai: **data layer → logic layer → routing layer**.
Har upar wali layer neeche wali par depend karti hai, ulta nahi.

## API routes

| Method | Route        | Kaam                   | Success | Not found |
| ------ | ------------ | ---------------------- | ------- | --------- |
| GET    | `/notes`     | Saari notes            | 200     | —         |
| GET    | `/notes/:id` | Aik note               | 200     | 404       |
| POST   | `/notes`     | Nayi note banao        | 201     | 400 (bad JSON) |
| PUT    | `/notes/:id` | Note update karo       | 200     | 404 / 400 |
| DELETE | `/notes/:id` | Note delete karo       | 200     | 404       |

Koi bhi doosri route → `404 { "message": "Resource nahi mila" }`

## Chalane ka tareeqa

```bash
npm install     # sirf devDependencies (typescript, @types/node)
npm run dev     # tsc build + node dist/server.js
```

| Script | Kaam |
| --- | --- |
| `npm run dev` | Build kar ke server chalata hai |
| `npm run build` | Sirf `dist/` banata hai |
| `npm run typecheck` | Sirf types check karta hai, koi file nahi likhta |
| `npm run watch` | File badalte hi dobara compile karta hai |

Default port `4375`, ya `PORT` env var se badlein:

```bash
PORT=3000 npm run dev
```

Try karne ke liye:

```bash
curl -X POST localhost:4375/notes -d '{"title":"Pehli note","content":"Test"}'
curl localhost:4375/notes
```

## Deliberate simplifications

Ye shortcuts seekhne ki asani ke liye liye gaye hain — production-grade nahi:

- **Sync `fs` methods** (`readFileSync`/`writeFileSync`) — blocking hain. Production
  mein `fs.promises` (async) use hota, jo Node ke non-blocking nature se match karta hai.
- **`Date.now()` se IDs** — practically unique hai, lekin guaranteed nahi.
  Production mein `uuid` jaisi library use hoti.
- **JSON file as database** — koi concurrency safety nahi. Real app mein
  MongoDB/Postgres.
