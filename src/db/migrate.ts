// Migration runner
//
// Kaam: db/migrations/ ki .sql files tarteeb se chalao, aur yaad rakho ke
// kaun si chal chuki hai. Ye script server ka hissa nahi - ye alag se
// `npm run migrate` se chalti hai aur apna kaam kar ke band ho jati hai.
import fs = require('fs');
import path = require('path');
import pg = require('pg');

// Yaad rahe: chalte waqt ye file dist/db/ mein hoti hai, src/db/ mein nahi.
// Is liye project root tak do level upar jana parta hai.
// Aur migrations root par hain, src/ ke andar nahi - kyunki tsc sirf .ts files
// ko dist/ mein le jata hai, .sql files ko chhod deta hai.
const MIGRATIONS_DIR = path.join(__dirname, '..', '..', 'db', 'migrations');

async function migrate(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;

  // Ye check hone aur na hone mein bara farq hai. Na ho to pg ek uljhi hui
  // error deta hai; yahan saaf bata dete hain ke asal masla kya hai.
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL nahi mili. Ye script .env se chalti hai - `npm run migrate` istemal karein.'
    );
  }

  // Pool nahi, Client. Pool kai connections khula rakhta hai taake requests
  // aati rahen - ye script ek dafa chal kar khatam ho jati hai, is liye ek hi
  // connection kaafi hai. Sath hi migrations ka ek ke baad ek chalna zaroori
  // hai, aur ek Client isi tarteeb ki zamanat deta hai.
  const client = new pg.Client({ connectionString });
  await client.connect();

  try {
    // Ye table hi is poore system ki yaaddasht hai. Iske baghair har dafa
    // saari migrations dobara chalti aur error deti.
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name       TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    const result = await client.query<{ name: string }>(
      'SELECT name FROM schema_migrations'
    );
    const alreadyApplied = new Set(result.rows.map((row) => row.name));

    // sort() isi liye ahm hai ke files ke naam 001_, 002_ se shuru hote hain.
    // Migrations ki tarteeb maayne rakhti hai - 002 mein woh column badla ja
    // sakta hai jo 001 ne banaya tha.
    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    let appliedCount = 0;

    for (const file of files) {
      if (alreadyApplied.has(file)) {
        console.log(`  chhoda   ${file}`);
        continue;
      }

      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');

      // Har migration apni alag transaction mein. Postgres mein CREATE TABLE
      // jaisi DDL bhi transaction ke andar chalti hai aur rollback ho sakti hai
      // (MySQL mein aisa nahi hota). Faida: agar file ke beech mein error aaye
      // to aadha-adhoora schema nahi bachta - ya poori migration lagti hai ya
      // bilkul nahi.
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query(
          'INSERT INTO schema_migrations (name) VALUES ($1)',
          [file]
        );
        await client.query('COMMIT');
        console.log(`  chalayi  ${file}`);
        appliedCount++;
      } catch (err) {
        await client.query('ROLLBACK');
        const message = err instanceof Error ? err.message : String(err);
        throw new Error(`Migration fail hui: ${file}\n  ${message}`);
      }
    }

    console.log(
      appliedCount === 0
        ? '\nSab migrations pehle se chal chuki hain, kuch karne ki zaroorat nahi.'
        : `\n${appliedCount} migration(s) chalayi gayin.`
    );
  } finally {
    // finally isi liye ke error ki soorat mein bhi connection band ho -
    // warna script latki reh jati hai.
    await client.end();
  }
}

migrate().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
