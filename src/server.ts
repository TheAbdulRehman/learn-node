// Is file ka sirf aik kaam hai: app ko chalana aur theek se band karna.
import app = require('./app');
import db = require('./db/pool');

// process.env se hamesha string ya undefined aati hai, number kabhi nahi.
// Number(undefined) NaN deta hai, aur NaN falsy hai - is liye || 4375 chal jata hai.
const PORT = Number(process.env.PORT) || 4375;

async function start(): Promise<void> {
  // Traffic lene se pehle database check karo. Agar DB tak pohanch hi nahi to
  // server chalane ka koi faida nahi - har request 500 degi. Behtar hai ke
  // saaf error de kar abhi ruk jayen.
  await db.verifyConnection();
  console.log('[db] connection theek hai');

  const server = app.listen(PORT, () => {
    console.log(`Server chal raha hai: http://localhost:${PORT}`);
  });

  // Graceful shutdown
  //
  // Ctrl+C ya deploy ke waqt process ko seedha maar dena ka matlab hai ke jo
  // requests us waqt chal rahi thin woh beech mein kat jayengi. server.close()
  // naye connections lena band kar deta hai lekin maujooda requests ko poora
  // hone deta hai - uske baad hi pool band karte hain.
  const shutdown = (signal: string): void => {
    console.log(`\n${signal} mila - band kar rahe hain...`);
    server.close(() => {
      void db.closePool().then(() => {
        console.log('sab band ho gaya.');
        process.exit(0);
      });
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch((err: unknown) => {
  console.error(
    'Server shuru nahi ho saka:',
    err instanceof Error ? err.message : err
  );
  process.exit(1);
});
