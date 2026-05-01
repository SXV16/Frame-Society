const fs = require('fs');

let html = fs.readFileSync('src/app/features/product/product.component.html', 'utf8');
const searchHTML = `<span class="text-sm text-gray-400">({{ product.reviews_count || 0 }} reviews)</span>\r\n            </div>`;
const replaceHTML = `<span class="text-sm text-gray-400">({{ product.reviews_count || 0 }} reviews)</span>\n            </div>\n            <div class="mt-2 text-sm">\n              <span [class]="(product.stock_status && product.stock_count > 0) ? 'text-green-400 font-bold tracking-widest uppercase text-xs' : 'text-red-400 font-bold tracking-widest uppercase text-xs'">{{ (product.stock_status && product.stock_count > 0) ? (product.stock_count >= 9 ? '9+ in stock' : (product.stock_count + ' in stock')) : 'Out of stock' }}</span>\n            </div>`;

const searchHTML_alt = searchHTML.replace('\r\n', '\n');
html = html.replace(searchHTML, replaceHTML).replace(searchHTML_alt, replaceHTML);

const searchBtn = `<button type="button" (click)="addToCart()" class="btn-primary flex-1 h-12 flex items-center justify-center gap-2">`;
const replaceBtn = `<button type="button" (click)="addToCart()" [disabled]="!product.stock_status || product.stock_count <= 0" class="btn-primary flex-1 h-12 flex items-center justify-center gap-2 disabled:opacity-50">`;
html = html.replace(searchBtn, replaceBtn);
fs.writeFileSync('src/app/features/product/product.component.html', html);

let homeHtml = fs.readFileSync('src/app/features/home/home.component.html', 'utf8');
const searchHomePrice = `<span class="text-[#D4AF37] site-title text-lg">USD \${{ product.price | number:'1.2-2' }}</span>`;
const replaceHomePrice = `<span class="text-[#D4AF37] site-title text-lg">USD \${{ product.price | number:'1.2-2' }}</span>\n                <span class="text-[10px] mt-1 uppercase font-bold tracking-widest" [class]="(product.stock_status && product.stock_count > 0) ? 'text-green-500' : 'text-red-500'">{{ (product.stock_status && product.stock_count > 0) ? (product.stock_count >= 9 ? '9+ in stock' : (product.stock_count + ' in stock')) : 'Out of stock' }}</span>`;
homeHtml = homeHtml.replace(searchHomePrice, replaceHomePrice);
fs.writeFileSync('src/app/features/home/home.component.html', homeHtml);
