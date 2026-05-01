const fs = require('fs');
let html = fs.readFileSync('src/app/features/product/product.component.html', 'utf8');

const topStarsOld = `<div class="flex items-center gap-2 pt-1 pb-4">
              <div class="flex">
                <button type="button" *ngFor="let s of [1,2,3,4,5]" (click)="initReview(s)" class="focus:outline-none hover:scale-125 transition-transform px-0.5" title="Rate {{ s }} stars">
                  <span class="material-symbols-outlined text-[20px] transition-colors" 
                        [ngClass]="(product.rating || 0) >= s ? 'text-[var(--gold)] drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]' : ((product.rating || 0) >= s - 0.5 ? 'text-[var(--gold)] opacity-80' : 'text-gray-700 opacity-40')">
                    {{ (product.rating || 0) >= s ? 'star' : ((product.rating || 0) >= s - 0.5 ? 'star_half' : 'star') }}
                  </span>
                </button>
              </div>`;

const topStarsNew = `<div class="flex items-center gap-2 pt-1 pb-4" (mouseleave)="hoverRating = 0">
              <div class="flex">
                <button type="button" *ngFor="let s of [1,2,3,4,5]" 
                        (mouseenter)="hoverRating = s"
                        (click)="setTopRating(s)" 
                        class="focus:outline-none hover:scale-125 transition-transform px-0.5" title="Rate {{ s }} stars">
                  <span class="material-symbols-outlined text-[20px] transition-colors" 
                        [ngClass]="
                          hoverRating >= s ? 'text-[var(--gold)] drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]' : 
                          (!hoverRating && topRatingInteracted && newRating >= s) ? 'text-[var(--gold)] drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]' :
                          (!hoverRating && !topRatingInteracted && (product.rating || 0) >= s) ? 'text-[var(--gold)] drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]' : 
                          (!hoverRating && !topRatingInteracted && (product.rating || 0) >= s - 0.5) ? 'text-[var(--gold)] opacity-80' : 
                          'text-gray-700 opacity-40'">
                    {{ hoverRating >= s ? 'star' : 
                       (!hoverRating && topRatingInteracted && newRating >= s) ? 'star' :
                       (!hoverRating && !topRatingInteracted && (product.rating || 0) >= s) ? 'star' : 
                       (!hoverRating && !topRatingInteracted && (product.rating || 0) >= s - 0.5) ? 'star_half' : 'star' }}
                  </span>
                </button>
              </div>`;

const bottomStarsOld = `<div class="flex gap-2">
                <button type="button" class="focus:outline-none" *ngFor="let s of [1,2,3,4,5]" (click)="newRating = s">
                  <span class="material-symbols-outlined text-3xl transition-transform hover:scale-110" 
                        [ngClass]="newRating >= s ? 'text-[var(--gold)] drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]' : 'text-gray-600'">
                    star
                  </span>
                </button>
              </div>`;

const bottomStarsNew = `<div class="flex gap-2" (mouseleave)="bottomHoverRating = 0">
                <button type="button" class="focus:outline-none" *ngFor="let s of [1,2,3,4,5]" 
                        (mouseenter)="bottomHoverRating = s" 
                        (click)="newRating = s; topRatingInteracted = true">
                  <span class="material-symbols-outlined text-3xl transition-transform hover:scale-110" 
                        [ngClass]="(bottomHoverRating ? bottomHoverRating >= s : newRating >= s) ? 'text-[var(--gold)] drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]' : 'text-gray-600'">
                    star
                  </span>
                </button>
              </div>`;

html = html.replace(topStarsOld, topStarsNew);
html = html.replace(bottomStarsOld, bottomStarsNew);

fs.writeFileSync('src/app/features/product/product.component.html', html);
