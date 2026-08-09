// "import type" - ye aam import se alag cheez hai. Ye sirf types ke liye hai
// aur compile hone ke baad output mein iska naam-o-nishan nahi hota, koi
// require() nahi banta. Is file ko express ka runtime object chahiye hi nahi,
// sirf uske types chahiyen - is liye yehi durust tareeqa hai.
import type { RequestHandler } from 'express';

// Ye middleware sab routes ke BAAD lagta hai. Yahan pohanchne ka matlab hi ye
// hai ke upar kisi route ne request nahi uthai - yaani route maujood nahi.
const notFound: RequestHandler = (req, res) => {
  res.status(404).json({
    message: `Route nahi mila: ${req.method} ${req.originalUrl}`,
  });
};

export = notFound;
