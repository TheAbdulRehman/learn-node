// Database connection - poori app mein bas yehi ek jagah hai jahan pool banta hai.
import pg = require('pg');

const connectionString = process.env.DATABASE_URL;

// Ye jaanch module load hote hi ho jati hai, yaani server start hone se pehle.
// Agar ye pehli request tak taalte, to server chal parta, log samajhte sab
// theek hai, aur masla tab khulta jab koi asal user request bhejta.
// Ghalti jitni jaldi saamne aaye utna behtar.
if (!connectionString) {
  throw new Error(
    'DATABASE_URL nahi mili. Server .env se chalta hai - `npm run dev` istemal karein.'
  );
}

// Yahan Pool chahiye, Client nahi - migration script ke bilkul ulta.
//
// Wajah: har request par naya connection banana bohot mehnga hai. TCP handshake
// + TLS handshake + Postgres ka apna authentication - aur hamara database
// ap-southeast-1 mein hai, yaani har handshake par network ka poora chakkar.
// Pool connections khule rakhta hai aur unhein baar baar istemal karta hai.
const pool = new pg.Pool({
  connectionString,

  // Ek waqt mein zyada se zyada kitne connections. Ye number database ki hadd
  // se kam hona chahiye - aur yaad rahe ke agar app ke kai instances chal rahe
  // hon to har instance ka apna pool hoga, to hadd unn sab ki jama hoti hai.
  max: 10,

  // Jo connection itni der bekaar pada rahe usay band kar do
  idleTimeoutMillis: 30_000,

  // Pool se connection maangne par itni der se zyada intezar mat karo -
  // warna request hamesha ke liye latak sakti hai
  connectionTimeoutMillis: 10_000,
});

// Ye listener lagana lazmi hai, marzi ki baat nahi.
//
// Pool ke andar bekaar pade connection par kabhi bhi error aa sakti hai
// (network toot gaya, Neon ne idle connection band kar diya). Node mein
// 'error' event agar koi na sun raha ho to woh throw ban kar poora process
// gira deta hai. Yahan sirf log kar dena kaafi hai - pool khud us kharab
// connection ko hata kar naya bana lega.
pool.on('error', (err) => {
  console.error('[db] bekaar pade connection par error:', err.message);
});

// Server start hone se pehle ek dafa asal query maar kar dekhna ke connection
// waqai banta hai ya nahi. Pool banane se connection nahi banta - woh sust
// (lazy) hai, pehli query par juratta hai. Is liye ghalat password jaisi
// ghalti pool banane par pakdi hi nahi jati.
async function verifyConnection(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
  } finally {
    // release() connection ko band nahi karta - usay pool ko wapis de deta hai.
    // finally mein isi liye hai ke error ki soorat mein bhi wapis jaye, warna
    // pool ka ek connection hamesha ke liye zaya ho jata (connection leak).
    client.release();
  }
}

async function closePool(): Promise<void> {
  await pool.end();
}

export = { pool, verifyConnection, closePool };
