const fs = require('fs');
let html = fs.readFileSync('src/app/shared/nav/nav.component.html', 'utf8');
html = html.replace('pb-10"', 'pb-10 pointer-events-none"');
html = html.replace('items-center"', 'items-center pointer-events-auto"');
fs.writeFileSync('src/app/shared/nav/nav.component.html', html);
