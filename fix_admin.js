const fs = require('fs');
let b = fs.readFileSync('src/app/features/admin/admin-products/admin-products.component.ts', 'utf8');
b = b.replace(/\\n/g, '\n');
fs.writeFileSync('src/app/features/admin/admin-products/admin-products.component.ts', b);
