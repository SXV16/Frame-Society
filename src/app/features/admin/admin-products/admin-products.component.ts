import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from '../../../core/services/products.service';
import { CategoriesService } from '../../../core/services/categories.service';
import { Product } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css'],
})
export class AdminProductsComponent implements OnInit {
  @ViewChild('imageFileInput') imageFileInput?: ElementRef<HTMLInputElement>;
  readonly sizeOptions = ['4x6', '5x7', '8x10', '11x14', '16x20', '18x24', '24x36', 'Small', 'Medium', 'Large'];
  readonly tagOptions = ['BESTSELLER', 'NEW', 'LIMITED', 'SALE', 'TRENDING', 'EXCLUSIVE', 'PREMIUM', 'POPULAR'];
  products: Product[] = [];
  categories: Category[] = [];
  loading = true;
  saving = false;
  error: string | null = null;
  success: string | null = null;
  form: FormGroup;
  editingId: number | null = null;
  showForm = false;
  productToDelete: { id: number, title: string } | null = null;

  selectedFiles: File[] = [];
  uploading = false;
  uploadError: string | null = null;
  sizesOpen = false;
  tagsOpen = false;

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      category_id: [null as number | null],
      imagesStr: [''],
      sizes: [[]],
      stock_status: [true],
      stock_count: [1, [Validators.required, Validators.min(0)]],
      tags: [[]],
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.categoriesService.getCategories().subscribe((c) => (this.categories = c));
  }

  @HostListener('document:click')
  closeDropdowns(): void {
    this.sizesOpen = false;
    this.tagsOpen = false;
  }

  loadProducts(): void {
    this.loading = true;
    this.productsService.getProducts().subscribe({
      next: (list) => (this.products = list),
      error: (err) => (this.error = err.error?.error || err.message),
      complete: () => (this.loading = false),
    });
  }

  openAdd(): void {
    this.editingId = null;
    this.form.reset({
      title: '',
      description: '',
      price: 0,
      category_id: null,
      imagesStr: '',
      sizes: [],
      stock_status: true,
      stock_count: 1,
      tags: [],
    });
    this.showForm = true;
    this.error = null;
    this.success = null;
  }

  openEdit(p: Product): void {
    this.editingId = p.id;
    this.form.patchValue({
      title: p.title,
      description: p.description || '',
      price: p.price,
      category_id: p.category_id,
      imagesStr: this.toStr(p.images),
      sizes: this.strToArray(p.sizes),
      stock_status: p.stock_status,
      stock_count: p.stock_count ?? 0,
      tags: this.strToArray(p.tags),
    });
    this.showForm = true;
    this.error = null;
    this.success = null;
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.error = null;
    this.sizesOpen = false;
    this.tagsOpen = false;
  }

  private toStr(val: string[] | string | null | undefined): string {
    if (!val) return '';
    if (Array.isArray(val)) return val.join(', ');
    if (typeof val === 'string') {
      try {
        const arr = JSON.parse(val);
        return Array.isArray(arr) ? arr.join(', ') : val;
      } catch {
        return val;
      }
    }
    return '';
  }

  private strToArray(val: string[] | string | null | undefined): string[] {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      try {
        const arr = JSON.parse(val);
        return Array.isArray(arr) ? arr : this.splitStr(val);
      } catch {
        return this.splitStr(val);
      }
    }
    return [];
  }

  private splitStr(s: string): string[] {
    return s.split(',').map((x) => x.trim()).filter(Boolean);
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    this.selectedFiles = files ? Array.from(files) : [];
  }

  openFilePicker(): void {
    this.imageFileInput?.nativeElement.click();
  }

  toggleDropdown(kind: 'sizes' | 'tags', event: Event): void {
    event.stopPropagation();
    if (kind === 'sizes') {
      this.sizesOpen = !this.sizesOpen;
      this.tagsOpen = false;
      return;
    }

    this.tagsOpen = !this.tagsOpen;
    this.sizesOpen = false;
  }

  selectedSummary(controlName: 'sizes' | 'tags', emptyLabel: string): string {
    const values = this.form.get(controlName)?.value as string[] | null;
    return values && values.length ? values.join(', ') : emptyLabel;
  }

  isSelected(controlName: 'sizes' | 'tags', option: string): boolean {
    const values = (this.form.get(controlName)?.value as string[] | null) || [];
    return values.includes(option);
  }

  toggleOption(controlName: 'sizes' | 'tags', option: string, event: Event): void {
    event.stopPropagation();
    const control = this.form.get(controlName);
    const current = ((control?.value as string[] | null) || []).slice();
    const next = current.includes(option)
      ? current.filter((value) => value !== option)
      : [...current, option];

    control?.setValue(next);
    control?.markAsDirty();
  }

  uploadImages(): void {
    if (!this.selectedFiles.length) {
      this.openFilePicker();
      return;
    }

    this.uploading = true;
    this.uploadError = null;

    const formData = new FormData();
    this.selectedFiles.forEach((file) => {
      formData.append('files', file);
    });

    this.http
      .post<{ urls: string[] }>(`${environment.apiBaseUrl}/upload`, formData)
      .subscribe({
        next: (res) => {
          const urls = res.urls || [];
          if (!urls.length) {
            this.uploadError = 'No URLs returned from upload.';
            this.uploading = false;
            return;
          }
          const ctrl = this.form.get('imagesStr');
          const current = (ctrl?.value as string) || '';
          const appended = urls.join(', ');
          ctrl?.setValue(current ? `${current}, ${appended}` : appended);
          this.selectedFiles = [];
          if (this.imageFileInput?.nativeElement) {
            this.imageFileInput.nativeElement.value = '';
          }
          this.uploading = false;
        },
        error: (err) => {
          console.error(err);
          this.uploadError = err.error?.error || 'Upload failed.';
          this.uploading = false;
        },
      });
  }

  save(): void {
    if (this.form.invalid) return;
    this.error = null;
    this.success = null;
    this.saving = true;
    const v = this.form.value;
    const stockCount = v.stock_status
      ? (v.stock_count != null ? parseInt(v.stock_count, 10) : 1)
      : 0;
    const payload: Partial<Product> = {
      title: v.title,
      description: v.description || null,
      price: parseFloat(v.price),
      category_id: v.category_id ? parseInt(v.category_id, 10) : null,
      images: this.strToArray(v.imagesStr).length ? this.strToArray(v.imagesStr) : null,
      sizes: Array.isArray(v.sizes) && v.sizes.length ? v.sizes : null,
      stock_status: !!v.stock_status,
      stock_count: Number.isNaN(stockCount) ? 0 : stockCount,
      tags: Array.isArray(v.tags) && v.tags.length ? v.tags : null,
    };

    const req = this.editingId
      ? this.productsService.updateProduct(this.editingId, payload)
      : this.productsService.createProduct(payload);

    req.subscribe({
      next: () => {
        this.success = this.editingId ? 'Product updated.' : 'Product created.';
        this.showForm = false;
        this.editingId = null;
        this.loadProducts();
      },
      error: (err) => {
        this.error = err.error?.error || err.message || 'Request failed.';
      },
      complete: () => (this.saving = false),
    });
  }

  openDeleteModal(id: number, title: string): void {
    this.productToDelete = { id, title };
  }

  cancelDeleteModal(): void {
    this.productToDelete = null;
  }

  confirmDeleteModal(): void {
    if (!this.productToDelete) return;
    const id = this.productToDelete.id;
    this.error = null;
    this.productsService.deleteProduct(id).subscribe({
      next: () => {
        this.productToDelete = null;
        this.success = 'Product deleted.';
        this.loadProducts();
      },
      error: (err) => {
        this.error = err.error?.error || err.message || 'Delete failed.';
        this.productToDelete = null;
      },
    });
  }

  productImage(p: Product): string {
    const img = p.images;
    if (Array.isArray(img) && img.length) return img[0];
    if (typeof img === 'string') {
      try {
        const arr = JSON.parse(img);
        return Array.isArray(arr) && arr.length ? arr[0] : '';
      } catch {
        return img;
      }
    }
    return '';
  }
}
