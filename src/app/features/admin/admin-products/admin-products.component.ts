import { Component, OnInit } from '@angular/core';
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
  products: Product[] = [];
  categories: Category[] = [];
  loading = true;
  saving = false;
  error: string | null = null;
  success: string | null = null;
  form: FormGroup;
  editingId: number | null = null;
  showForm = false;
  deleteConfirmId: number | null = null;
  selectedFiles: File[] = [];
  uploading = false;
  uploadError: string | null = null;

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
      sizesStr: [''],
      stock_status: [true],
      tagsStr: [''],
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.categoriesService.getCategories().subscribe((c) => (this.categories = c));
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
      sizesStr: '',
      stock_status: true,
      tagsStr: '',
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
      sizesStr: this.toStr(p.sizes),
      stock_status: p.stock_status,
      tagsStr: this.toStr(p.tags),
    });
    this.showForm = true;
    this.error = null;
    this.success = null;
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.error = null;
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

  private strToArray(s: string): string[] {
    if (!s || !s.trim()) return [];
    return s.split(',').map((x) => x.trim()).filter(Boolean);
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    this.selectedFiles = files ? Array.from(files) : [];
  }

  uploadImages(): void {
    if (!this.selectedFiles.length) return;
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
    const payload: Partial<Product> = {
      title: v.title,
      description: v.description || null,
      price: parseFloat(v.price),
      category_id: v.category_id ? parseInt(v.category_id, 10) : null,
      images: this.strToArray(v.imagesStr).length ? this.strToArray(v.imagesStr) : null,
      sizes: this.strToArray(v.sizesStr).length ? this.strToArray(v.sizesStr) : null,
      stock_status: !!v.stock_status,
      tags: this.strToArray(v.tagsStr).length ? this.strToArray(v.tagsStr) : null,
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

  confirmDelete(id: number): void {
    this.deleteConfirmId = id;
  }

  cancelDelete(): void {
    this.deleteConfirmId = null;
  }

  deleteProduct(id: number): void {
    this.error = null;
    this.productsService.deleteProduct(id).subscribe({
      next: () => {
        this.deleteConfirmId = null;
        this.success = 'Product deleted.';
        this.loadProducts();
      },
      error: (err) => {
        this.error = err.error?.error || err.message || 'Delete failed.';
        this.deleteConfirmId = null;
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
