// Ye file sirf fs module ke saath kaam karti hai - JSON file read/write ke liye
const fs = require('fs');
const path = require('path');

// notes.json ka full path
const filePath = path.join(__dirname, '..', 'data', 'notes.json');

// Saari notes file se parh kar array return karta hai
function readNotes() {
  const rawData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(rawData);
}

// Naya array file mein wapis likh deta hai
function writeNotes(notesArray) {
  fs.writeFileSync(filePath, JSON.stringify(notesArray, null, 2));
}

module.exports = { readNotes, writeNotes };
