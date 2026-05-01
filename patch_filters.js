const fs = require('fs');

let html = fs.readFileSync('src/app/features/home/home.component.html', 'utf8');

const priceRegex = /<div class="flex items-center justify-between mb-2 text-xs text-white">[\s\S]*?aria-label="Filter by maximum price"\s*\/>/;

const newPriceBlock = `<div class="flex items-center justify-between mb-2 text-xs text-white">
            <span>$0</span>
            <span class="text-[#D4AF37] font-bold">{{ maxPrice >= 500 ? '$500+' : '$' + maxPrice }}</span>
          </div>
          <input
            type="range"
            class="w-full h-1 bg-[#5E239D] rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
            min="0"
            max="500"
            step="10"
            [(ngModel)]="maxPrice"
            (change)="onPriceChange()"
            aria-label="Filter by maximum price"
          />`;

html = html.replace(priceRegex, newPriceBlock);

const sizeRegex = /<div class="grid grid-cols-3 gap-2">[\s\S]*?<\/div>/;
const newSizeBlock = `<div class="grid grid-cols-2 gap-2">
            <button *ngFor="let size of sizeOptions" 
                    class="border py-1 text-xs text-white transition-colors uppercase tracking-widest"
                    [ngClass]="selectedSize === size ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37] font-bold' : 'border-[#5E239D] hover:border-[#D4AF37] hover:text-[#D4AF37]'"
                    (click)="onSizeChange(size)">
              {{ size }}
            </button>
          </div>`;

html = html.replace(sizeRegex, newSizeBlock);

fs.writeFileSync('src/app/features/home/home.component.html', html);
