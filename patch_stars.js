const fs = require('fs');
let html = fs.readFileSync('src/app/features/product/product.component.html', 'utf8');

const newHTML = `            <!-- Star Rating Interactive Hook -->
            <div class="flex items-center gap-2 pt-1 pb-4">
              <div class="flex">
                <button type="button" *ngFor="let s of [1,2,3,4,5]" (click)="initReview(s)" class="focus:outline-none hover:scale-125 transition-transform px-0.5" title="Rate {{ s }} stars">
                  <span class="material-symbols-outlined text-[20px] transition-colors" 
                        [ngClass]="(newRating || product.rating || 0) >= s ? 'text-[var(--gold)] drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]' : (((newRating || product.rating || 0) >= s - 0.5 && !newRating) ? 'text-[var(--gold)] opacity-80' : 'text-gray-700 opacity-40')">
                    {{ (newRating || product.rating || 0) >= s ? 'star' : (((newRating || product.rating || 0) >= s - 0.5 && !newRating) ? 'star_half' : 'star') }}
                  </span>
                </button>
              </div>
              <span class="text-sm text-gray-400 cursor-pointer hover:text-[var(--gold)] hover:underline ml-1" (click)="scrollToReviews()">({{ product.reviews_count || 0 }} reviews)</span>
            </div>`;

html = html.replace(/<!-- Star Rating Visualization -->[\s\S]*?<\/div>\s*<\/div>\s*<div class="mt-2 text-sm">/, newHTML + '\n            <div class="mt-2 text-sm">');
fs.writeFileSync('src/app/features/product/product.component.html', html);
