// Routing layer - URL aur method dekh kar decide karta hai ke konsa controller chalega
const {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} = require('../controllers/notesController');

// Ye router server ko batata hai: request maine handle kar li ya nahi (true/false)
function notesRouter(req, res) {
  const method = req.method;

  // Query string hata dete hain - '/notes?sort=new' ka pathname sirf '/notes' hai
  const pathname = req.url.split('?')[0];

  // '/notes/123' -> ['', 'notes', '123'] -> filter(Boolean) khali strings hata deta hai -> ['notes', '123']
  const parts = pathname.split('/').filter(Boolean);

  // Pehla hissa 'notes' nahi hai? Matlab ye request hamari nahi - agle router ko de do
  if (parts[0] !== 'notes') return false;

  // '/notes/123/extra' jaisa kuch aaya to bhi hamara nahi - server 404 de dega
  if (parts.length > 2) return false;

  const id = parts[1]; // '/notes' par ye undefined hoga

  if (method === 'GET' && !id) {
    getAllNotes(req, res);
    return true;
  }

  if (method === 'GET' && id) {
    // id yahan se controller ko pass hoti hai - controller khud URL parse nahi karta
    getNoteById(req, res, id);
    return true;
  }

  if (method === 'POST' && !id) {
    createNote(req, res);
    return true;
  }

  if (method === 'PUT' && id) {
    updateNote(req, res, id);
    return true;
  }

  if (method === 'DELETE' && id) {
    deleteNote(req, res, id);
    return true;
  }

  // Path to '/notes' wala tha lekin method match nahi hua - handle nahi kiya
  return false;
}

module.exports = notesRouter;
