# learn-node

Node.js seekhne ka project — har cheez samajh kar, qadam ba qadam banayi jati hai.

## Abhi kahan hain

Pehle marhale mein **raw Node** (`http` + `fs`) se poori Notes CRUD API haath se
likhi gayi thi — koi framework nahi, koi database nahi. Woh kaam mukammal hua
aur phir TypeScript par migrate hua. Uska saara code git history mein maujood
hai (commit `11b47c6` tak).

Ab wahi CRUD **dobara** banayi ja rahi hai, is dafa production jaise setup ke
sath. Isi liye source files khali kar di gayi hain — maqsad migrate karna nahi,
naye sire se samajh kar banana hai.

## Naya stack

| Cheez | Faisla | Kyun |
| --- | --- | --- |
| Language | TypeScript, `tsc` build (`src/` → `dist/`) | Type error build rok de |
| Modules | CommonJS, `import x = require('y')` | `require` hi hai, magar types zinda rehte hain |
| Routing | Express | Pehle manual router khud likha tha, ab muqabla saaf dikhega |
| Database | PostgreSQL (Neon, online) | — |
| Queries | **Pure SQL** — koi ORM/query builder nahi | SQL khud likhna hi maqsad hai |
| Env | Node ka native `--env-file` | `dotenv` package ki zaroorat nahi (Node ≥ 20.6) |

Packages sirf tab add hote hain jab waqai zaroori hon.

## Chalane ka tareeqa

```bash
npm install
npm run dev
```

| Script | Kaam |
| --- | --- |
| `npm run dev` | Build kar ke chalata hai |
| `npm run build` | Sirf `dist/` banata hai |
| `npm run typecheck` | Sirf types check karta hai, koi file nahi likhta |
| `npm run watch` | File badalte hi dobara compile |

## Structure

```
learn-node/
├── src/
│   └── server.ts       # abhi khali
├── dist/               # tsc output (gitignored)
├── tsconfig.json
└── CLAUDE.md           # is project ka teaching process aur conventions
```
