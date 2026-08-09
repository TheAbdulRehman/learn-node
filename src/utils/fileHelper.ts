// Ye file sirf fs module ke saath kaam karti hai - JSON file read/write ke liye
const fs = require('fs');
const path = require('path');

// Ye ek "factory" function hai - file ka naam do, aur usi file ke liye
// read/write functions wapis milte hain. Har resource apna helper banata hai:
//   const notesFile = createFileHelper('notes');   -> data/notes.json
//   const usersFile = createFileHelper('users');   -> data/users.json
function createFileHelper(fileName) {
  // Ye path sirf ek dafa bana - andar wale functions isko yaad rakhte hain (closure)
  //
  // Dhyan se: chalte waqt ye file dist/utils/ mein hoti hai, src/utils/ mein nahi.
  // Isliye project root tak pohanchne ke liye DO level upar jana padta hai:
  //   dist/utils -> dist -> <root> -> data/notes.json
  const filePath = path.join(__dirname, '..', '..', 'data', `${fileName}.json`);

  // File maujood na ho to khali array bana do - warna readFileSync throw karti hai
  function ensureFile() {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '[]');
    }
  }

  // Saara data file se parh kar array return karta hai
  function read() {
    ensureFile();
    const rawData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(rawData);
  }

  // Naya array file mein wapis likh deta hai
  function write(dataArray) {
    fs.writeFileSync(filePath, JSON.stringify(dataArray, null, 2));
  }

  return { read, write };
}

module.exports = createFileHelper;
