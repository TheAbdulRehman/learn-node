const http = require("http");
const notesRouter = require("./routes/notesRoutes");

// Sab routers ek array mein - naya resource add karna ho to bas yahan ek line
// Aage chal kar: [notesRouter, usersRouter, productsRouter, ...]
const routers = [notesRouter];

const server = http.createServer((req, res) => {
  // 'some' har router ko bari-bari chalata hai aur jaise hi koi 'true' return kare,
  // wahin ruk jata hai - baaqi routers ko request milti hi nahi.
  // Ye zaroori hai: ek hi request par do dafa res.end() call karna invalid hai.
  const wasHandled = routers.some((router) => router(req, res));

  if (!wasHandled) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Resource nahi mila" }));
  }
});

const PORT = process.env.PORT || 4375;

server.listen(PORT, () => {
  console.log(`Server chal raha hai: http://localhost:${PORT}`);
});
