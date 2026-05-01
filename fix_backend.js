const fs = require('fs');

const filesToFix = [
  'backend/routes/products.js',
  'backend/routes/auth.js',
  'backend/routes/payments.js'
];

for (const file of filesToFix) {
  try {
    let b = fs.readFileSync(file, 'utf8');
    if (b.includes('\\n')) {
      b = b.replace(/\\n/g, '\n');
      fs.writeFileSync(file, b);
      console.log('Fixed', file);
    }
  } catch (err) { }
}
