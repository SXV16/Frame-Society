const fs = require('fs');
let html = fs.readFileSync('src/app/features/admin/admin-products/admin-products.component.html', 'utf8');
html = html.replace(/<button type="button" \(click\)="confirmDelete\(p\.id\)"[\s\S]*?<\/ng-container>/, '<button type="button" (click)="deleteProduct(p.id, p.title)" class="text-red-400 hover:underline text-sm font-medium">Delete</button>');
fs.writeFileSync('src/app/features/admin/admin-products/admin-products.component.html', html);
