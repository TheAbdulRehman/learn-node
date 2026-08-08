// Business logic yahan likhi jati hai - request/response ko handle karta hai
const { readNotes, writeNotes } = require('../utils/fileHelper');

// GET /notes - saari notes wapis bhejta hai
function getAllNotes(req, res) {
  const notes = readNotes();
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(notes));
}

// GET /notes/:id - ek specific note dhoondta hai
function getNoteById(req, res, id) {
  const notes = readNotes();
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
    const { title, content } = JSON.parse(body);

    const notes = readNotes();
    const newNote = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date().toISOString(),
    };

    notes.push(newNote);
    writeNotes(notes);

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(newNote));
  });
}

// TODO: updateNote aur deleteNote abhi baaqi hain - agle chunk mein
module.exports = { getAllNotes, getNoteById, createNote };
