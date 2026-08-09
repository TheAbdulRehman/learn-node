import type { ErrorRequestHandler } from 'express';
import AppError = require('../utils/AppError');

// Express is function ko error handler samajhta hai kyunki iske CHAAR parameters
// hain (err, req, res, next). Teen hote to ye aam middleware ban jata.
// 'next' istemal nahi ho raha, lekin usko hatana mana hai - warna Express is
// function ko error handler pehchanna hi band kar dega.
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // 1) Hamari apni phenki hui error - message client ko dikhana mehfooz hai
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  // 2) express.json() kharab JSON milne par SyntaxError phenkta hai.
  //    Raw Node wale code mein hum yehi kaam khud try/catch se karte thay.
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ message: 'Ghalat JSON bheja gaya hai' });
    return;
  }

  // 3) Yahan tak pohanchne ka matlab: ye error hamari socha-samjha hui nahi.
  //    Server par poori error log karte hain (debug ke liye), lekin client ko
  //    sirf aam sa jumla bhejte hain - warna stack trace, file paths ya SQL
  //    query bahar leak ho sakti hai.
  console.error('[anjaan error]', err);
  res.status(500).json({ message: 'Server mein kuch ghalat ho gaya' });
};

export = errorHandler;
