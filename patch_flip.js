const fs = require('fs');
let html = fs.readFileSync('src/app/features/landingpage/landingpage.component.html', 'utf8');

html = html.replace(
  '<a\n          class="site-kicker text-[var(--gold)] hover:text-white transition-colors mt-6 md:mt-0 flex items-center gap-2 cursor-pointer">',
  '<a routerLink="/store"\n          class="site-kicker text-[var(--gold)] hover:text-white transition-colors mt-6 md:mt-0 flex items-center gap-2 cursor-pointer">'
);

const newCards = `<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- CARD 1 -->
        <div class="group [perspective:1000px] h-[500px]">
          <div class="relative w-full h-full duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] rounded-sm border border-gray-800 group-hover:border-[var(--gold)]/30 transition-all shadow-2xl">
            <!-- Front -->
            <div class="absolute w-full h-full [backface-visibility:hidden] overflow-hidden bg-black cursor-default rounded-sm">
              <img src="assets/categories/anime-collection.png" alt="Anime Collection" class="absolute inset-0 w-full h-full object-cover opacity-60" />
              <div class="absolute inset-0 bg-gradient-to-t from-[var(--deep-purple)] via-transparent to-transparent opacity-90"></div>
              <div class="absolute bottom-0 left-0 p-8 w-full cursor-pointer">
                <span class="site-kicker text-[var(--gold)] mb-2 block">Category 01</span>
                <h3 class="site-title text-4xl text-white mb-2">Anime Collection</h3>
              </div>
            </div>
            <!-- Back -->
            <div class="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-[#180B2D] to-black flex flex-col justify-center items-center p-8 text-center border overflow-hidden border-[var(--gold)]/50 rounded-sm">
              <div class="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] opacity-5 rounded-full blur-[80px]"></div>
              <span class="material-symbols-outlined text-[var(--gold)] text-5xl mb-4 opacity-80">swords</span>
              <h3 class="site-title text-3xl text-white mb-4">Anime Details</h3>
              <p class="text-white/70 text-sm mb-10 leading-relaxed font-sans">
                Experience legendary scenes and character artistry. From timeless classics to the modern frontier of animation, our expertly framed anime collection delivers profound emotional weight right to your wall.
              </p>
              <a routerLink="/store" [queryParams]="{category: 1}" class="btn-primary w-full shadow-lg shadow-black/50">Explore Set</a>
            </div>
          </div>
        </div>

        <!-- CARD 2 -->
        <div class="group [perspective:1000px] h-[500px]">
          <div class="relative w-full h-full duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] rounded-sm border border-gray-800 group-hover:border-[var(--gold)]/30 transition-all shadow-2xl">
            <!-- Front -->
            <div class="absolute w-full h-full [backface-visibility:hidden] overflow-hidden bg-black cursor-default rounded-sm">
              <img src="assets/categories/cinema-collection.png" alt="Cinema Collection" class="absolute inset-0 w-full h-full object-cover opacity-60" />
              <div class="absolute inset-0 bg-gradient-to-t from-[var(--deep-purple)] via-transparent to-transparent opacity-90"></div>
              <div class="absolute bottom-0 left-0 p-8 w-full cursor-pointer">
                <span class="site-kicker text-[var(--gold)] mb-2 block">Category 02</span>
                <h3 class="site-title text-4xl text-white mb-2">Cinema Collection</h3>
              </div>
            </div>
            <!-- Back -->
            <div class="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-[#180B2D] to-black flex flex-col justify-center items-center p-8 text-center border overflow-hidden border-[var(--gold)]/50 rounded-sm">
              <div class="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] opacity-5 rounded-full blur-[80px]"></div>
              <span class="material-symbols-outlined text-[var(--gold)] text-5xl mb-4 opacity-80">movie</span>
              <h3 class="site-title text-3xl text-white mb-4">Cinema Legends</h3>
              <p class="text-white/70 text-sm mb-10 leading-relaxed font-sans">
                Classic scenes, brilliant actors, and visionary directors. Bring Hollywood’s grandest cinematic atmospheres into your space with impeccably preserved framing and dark-room stylings.
              </p>
              <a routerLink="/store" [queryParams]="{category: 2}" class="btn-primary w-full shadow-lg shadow-black/50">Explore Set</a>
            </div>
          </div>
        </div>

        <!-- CARD 3 -->
        <div class="group [perspective:1000px] h-[500px]">
          <div class="relative w-full h-full duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] rounded-sm border border-gray-800 group-hover:border-[var(--gold)]/30 transition-all shadow-2xl">
            <!-- Front -->
            <div class="absolute w-full h-full [backface-visibility:hidden] overflow-hidden bg-black cursor-default rounded-sm">
              <img src="assets/categories/gaming-collection.png" alt="Gaming Collection" class="absolute inset-0 w-full h-full object-cover opacity-60" />
              <div class="absolute inset-0 bg-gradient-to-t from-[var(--deep-purple)] via-transparent to-transparent opacity-90"></div>
              <div class="absolute bottom-0 left-0 p-8 w-full cursor-pointer">
                <span class="site-kicker text-[var(--gold)] mb-2 block">Category 03</span>
                <h3 class="site-title text-4xl text-white mb-2">Gaming Collection</h3>
              </div>
            </div>
            <!-- Back -->
            <div class="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-[#180B2D] to-black flex flex-col justify-center items-center p-8 text-center border overflow-hidden border-[var(--gold)]/50 rounded-sm">
              <div class="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] opacity-5 rounded-full blur-[80px]"></div>
              <span class="material-symbols-outlined text-[var(--gold)] text-5xl mb-4 opacity-80">stadia_controller</span>
              <h3 class="site-title text-3xl text-white mb-4">Digital Worlds</h3>
              <p class="text-white/70 text-sm mb-10 leading-relaxed font-sans">
                Epic quests, neon dystopias, and unforgettable gaming experiences. We’ve meticulously framed iconic gaming moments for the ultimate collector's studio space.
              </p>
              <a routerLink="/store" [queryParams]="{category: 3}" class="btn-primary w-full shadow-lg shadow-black/50">Explore Set</a>
            </div>
          </div>
        </div>

      </div>`;

html = html.replace(/<div class="grid grid-cols-1 md:grid-cols-3 gap-8">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/, newCards + '\n    </div>\n  </section>');

fs.writeFileSync('src/app/features/landingpage/landingpage.component.html', html);
