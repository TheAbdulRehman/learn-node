// Is file ka sirf aik kaam hai: app ko port par sunane par lagana.
import app = require('./app');

// process.env se hamesha string ya undefined aati hai, number kabhi nahi.
// Number(undefined) NaN deta hai, aur NaN falsy hai - is liye || 4375 chal jata hai.
const PORT = Number(process.env.PORT) || 4375;

app.listen(PORT, () => {
  console.log(`Server chal raha hai: http://localhost:${PORT}`);
});
