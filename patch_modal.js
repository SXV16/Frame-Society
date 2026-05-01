const fs = require('fs');
let html = fs.readFileSync('src/app/features/admin/admin-products/admin-products.component.html', 'utf8');

// Update button
html = html.replace(
  '<button type="button" (click)="deleteProduct(p.id, p.title)" class="text-red-400 hover:underline text-sm font-medium">Delete</button>',
  '<button type="button" (click)="openDeleteModal(p.id, p.title)" class="text-red-400 hover:underline text-sm font-medium">Delete</button>'
);

// Append modal
const modalHTML = `
<!-- Delete Confirmation Modal -->
<div *ngIf="productToDelete" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
  <div class="card p-8 md:p-12 max-w-lg w-full text-center border border-[var(--gold)]/30 box-shadow-glow animate-fade-in relative overflow-hidden bg-[#120f16]">
    <div class="absolute -top-10 -right-10 opacity-5">
      <span class="material-symbols-outlined text-[150px] text-[var(--gold)]">delete_forever</span>
    </div>

    <span class="material-symbols-outlined text-5xl text-red-400 mb-6 drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]">warning</span>
    
    <h3 class="site-title text-3xl text-white mb-4">Confirm Deletion</h3>
    <p class="text-gray-300 text-lg mb-8 leading-relaxed">
      Are you absolutely sure you want to permanently delete the frame "<span class="text-[var(--gold)]">{{ productToDelete.title }}</span>"?
      <br><span class="text-xs uppercase tracking-widest text-red-400 mt-4 block">This action cannot be undone.</span>
    </p>

    <div class="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
      <button type="button" (click)="cancelDeleteModal()" class="btn-secondary w-full sm:w-auto px-8 py-3">Cancel</button>
      <button type="button" (click)="confirmDeleteModal()" class="btn-primary w-full sm:w-auto px-8 py-3 !bg-red-900 border !border-red-500 hover:!bg-red-800 text-white shadow-[0_0_20px_rgba(248,113,113,0.3)]">
        Erase Frame
      </button>
    </div>
  </div>
</div>
`;

// Insert modal right before the final closing div
html = html.replace('</div>\n</div>\n', '</div>\n</div>\n' + modalHTML);

fs.writeFileSync('src/app/features/admin/admin-products/admin-products.component.html', html);
