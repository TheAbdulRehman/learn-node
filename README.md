# learn-node

Pure Node.js se banayi gayi **Notes CRUD API** — bina Express, bina database.
Ye ek **learning project** hai: maqsad ye samajhna hai ke Express jo cheezein
internally karta hai (routing, body parsing, status codes) woh raw Node mein
kaise hoti hain.

## Kya use ho raha hai

Sirf Node ke built-in modules — koi npm dependency nahi:

- `http` — server aur manual routing
- `fs` — JSON file mein data persist karna
- `path` — cross-platform file paths

## Folder structure

Flat, layered structure — har layer ka aik hi kaam hai:

```
learn-node/
├── server.js               # HTTP server + routers ka chain (abhi baaqi)
├── routes/                 # Routing layer - URL/method dekh kar controller chunta hai
│   └── notesRoutes.js      # (abhi baaqi)
├── controllers/            # Logic layer - actual CRUD kaam
│   └── notesController.js
├── utils/                  # Helpers
│   └── fileHelper.js       # JSON file read/write
└── data/                   # "Database" - flat JSON files
    └── notes.json
```

Layers ka order jaan-boojh kar aisa hai: **data layer → logic layer → routing layer**.
Har upar wali layer neeche wali par depend karti hai, ulta nahi.

## API routes (planned)

| Method | Route        | Kaam                    | Status  |
| ------ | ------------ | ----------------------- | ------- |
| GET    | `/notes`     | Saari notes             | ✅ Done |
| GET    | `/notes/:id` | Aik note                | ✅ Done |
| POST   | `/notes`     | Nayi note banao         | ✅ Done |
| PUT    | `/notes/:id` | Note update karo        | ⬜ Baaqi |
| DELETE | `/notes/:id` | Note delete karo        | ⬜ Baaqi |

## Chalane ka tareeqa

> **Note:** abhi `server.js` aur `routes/notesRoutes.js` nahi bane, isliye
> server abhi run nahi hota. Ye agle chunk mein banenge.

```bash
npm start
```

## Deliberate simplifications

Ye shortcuts seekhne ki asani ke liye liye gaye hain — production-grade nahi:

- **Sync `fs` methods** (`readFileSync`/`writeFileSync`) — blocking hain. Production
  mein `fs.promises` (async) use hota, jo Node ke non-blocking nature se match karta hai.
- **`Date.now()` se IDs** — practically unique hai, lekin guaranteed nahi.
  Production mein `uuid` jaisi library use hoti.
- **JSON file as database** — koi concurrency safety nahi. Real app mein
  MongoDB/Postgres.
