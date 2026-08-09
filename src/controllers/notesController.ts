// Business logic yahan likhi jati hai - request/response ko handle karta hai
const createFileHelper = require('../utils/fileHelper');

// 'notes' ke liye apna helper - ye data/notes.json se juda hua hai
const notesFile = createFileHelper('notes');

// GET /notes - saari notes wapis bhejta hai
function getAllNotes(req, res) {
  const notes = notesFile.read();
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(notes));
}

// GET /notes/:id - ek specific note dhoondta hai
function getNoteById(req, res, id) {
  const notes = notesFile.read();
  const note = notes.find((n) => n.id === id);

  if (!note) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Note nahi mili' }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(note));
}

// POST /notes - nayi note banata hai
function createNote(req, res) {
  let body = ''; // request ka data chunks mein aata hai, isliye collect karna padega

  // Data aate hi 'data' event fire hoti hai - hum usko sunte hain
  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  // Jab pura data aa chuka - 'end' event fire hoti hai
  req.on('end', () => {
    // Client kuch bhi bhej sakta hai - agar JSON kharab hua to parse throw karega
    // aur poora server crash ho jayega. Isliye try/catch zaroori hai.
    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Ghalat JSON bheja gaya hai' }));
      return;
    }

    const { title, content } = parsed;

    const notes = notesFile.read();
    const newNote = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date().toISOString(),
    };

    notes.push(newNote);
    notesFile.write(notes);

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(newNote));
  });
}

// PUT /notes/:id - maujooda note update karta hai
function updateNote(req, res, id) {
  let body = ''; // wahi chunk-collecting pattern jo createNote mein tha

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Ghalat JSON bheja gaya hai' }));
      return;
    }

    const { title, content } = parsed;

    const notes = notesFile.read();
    // find nahi, findIndex - kyunki humein array ke andar wali jagah chahiye taake wahin overwrite kar sakein
    const index = notes.findIndex((n) => n.id === id);

    if (index === -1) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Note nahi mili' }));
      return;
    }

    // Purani note ko spread kar ke sirf nayi values upar likh dete hain
    // ?? ka matlab: agar client ne field bheji hi nahi, to purani value rehne do
    notes[index] = {
      ...notes[index],
      title: title ?? notes[index].title,
      content: content ?? notes[index].content,
      updatedAt: new Date().toISOString(),
    };

    notesFile.write(notes);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(notes[index]));
  });
}

// DELETE /notes/:id - note hata deta hai
function deleteNote(req, res, id) {
  const notes = notesFile.read();
  // filter nayi array banata hai jismein sirf wo notes hain jinki id match nahi karti
  const remainingNotes = notes.filter((n) => n.id !== id);

  // Agar length badli hi nahi, matlab is id ki koi note thi hi nahi
  if (remainingNotes.length === notes.length) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Note nahi mili' }));
    return;
  }

  notesFile.write(remainingNotes);

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Note delete ho gayi' }));
}

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};
