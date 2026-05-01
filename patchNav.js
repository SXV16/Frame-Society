const fs = require('fs');
let b = fs.readFileSync('src/app/shared/nav/nav.component.html', 'utf8');
const s = '<span class="text-white/90 text-sm truncate max-w-[120px]">{{ user.name }}</span>';
const r = '<a routerLink="/profile" class="flex items-center gap-2 hover:opacity-80 transition-opacity"><div class="w-8 h-8 rounded-full border border-[var(--gold)]/50 overflow-hidden bg-black/60 flex items-center justify-center"><img *ngIf="user.profile_picture_url" [src]="user.profile_picture_url" class="w-full h-full object-cover" /><span *ngIf="!user.profile_picture_url" class="material-symbols-outlined text-[var(--gold)]/80 text-[14px]">person</span></div><span class="text-white/90 text-sm truncate max-w-[120px]">{{ user.name }}</span></a>';
b = b.replace(s, r);
fs.writeFileSync('src/app/shared/nav/nav.component.html', b);
