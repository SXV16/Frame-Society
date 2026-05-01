const fs = require('fs');
let b = fs.readFileSync('src/app/features/admin/admin-products/admin-products.component.html', 'utf8');
const search1 = '<label for="stock" class="text-white text-sm">In stock</label>\r\n        </div>';
const search1_alt = '<label for="stock" class="text-white text-sm">In stock</label>\n        </div>';
let r1 = '<label for="stock" class="text-white text-sm">In stock</label>\n        </div>\n        <div class="md:col-span-2" *ngIf="form.get(\'stock_status\')?.value">\n          <label class="input-label">Stock Count *</label>\n          <input formControlName="stock_count" type="number" min="0" class="input input--light" style="width: 150px;" />\n        </div>';
b = b.replace(search1, r1).replace(search1_alt, r1);

const search2 = `<span [class]="p.stock_status ? 'text-green-400' : 'text-red-400'">{{ p.stock_status ? 'In stock' : 'Out of stock' }}</span>`;
let r2 = `<span [class]="(p.stock_status && p.stock_count > 0) ? 'text-green-400' : 'text-red-400'">{{ (p.stock_status && p.stock_count > 0) ? (p.stock_count >= 9 ? '9+ in stock' : (p.stock_count + ' in stock')) : 'Out of stock' }}</span>`;
b = b.replace(search2, r2);

fs.writeFileSync('src/app/features/admin/admin-products/admin-products.component.html', b);
