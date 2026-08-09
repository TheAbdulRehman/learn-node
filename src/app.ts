// Ye file sirf Express app banati aur configure karti hai.
// Yahan koi port nahi khulta - wo kaam server.ts ka hai. Wajah neeche samjhayi hai.
import express = require('express');
import notFound = require('./middleware/notFound');
import errorHandler = require('./middleware/errorHandler');

const app = express();

// Ye ek line poora wo kaam kar deti hai jo humne raw Node mein khud likha tha:
//   req.on('data', chunk => body += chunk)
//   req.on('end', () => JSON.parse(body))  + try/catch
// Ab parsed body seedha req.body mein mil jati hai.
app.use(express.json());

// Health route - sirf ye batane ke liye ke server zinda hai.
// Aage database aane ke baad ye jaanchne mein kaam aayega ke masla app mein hai ya DB mein.
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Notes ke routes yahan lagenge - abhi banana baaqi hai (Postgres ke saath).

// ===== Yahan se neeche wali cheezon ki TARTEEB ahm hai =====
// Express middleware ko upar se neeche chalata hai. Agar notFound ko routes se
// pehle rakh dete, to har request 404 ban jati - kyunki wo sab se pehle chal
// kar javab bhej deta aur asal route ki bari aati hi nahi.

// Sab routes ke baad: yahan pohanchne ka matlab hai koi route match nahi hua
app.use(notFound);

// Sab se aakhir mein: error handler. Iske chaar parameters hain, isi se
// Express pehchanta hai ke ye aam middleware nahi, error handler hai.
app.use(errorHandler);

export = app;
