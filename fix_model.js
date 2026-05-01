const fs = require('fs');
let text = fs.readFileSync('src/app/core/models/product.model.ts', 'utf8');
text = text.replace('stock_status: boolean;\\n  stock_count?: number;', 'stock_status: boolean;\n  stock_count?: number;');
fs.writeFileSync('src/app/core/models/product.model.ts', text);
