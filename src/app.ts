// Ye file sirf Express app banati aur configure karti hai.
// Yahan koi port nahi khulta - wo kaam server.ts ka hai. Wajah neeche samjhayi hai.
import express = require('express');

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

export = app;
