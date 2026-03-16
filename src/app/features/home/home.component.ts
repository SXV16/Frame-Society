import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { CategoriesService } from '../../core/services/categories.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { ProductListParams } from '../../core/models/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  loading = true;
  sort: ProductListParams['sort'] = undefined;
  categoryId: number | null = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe((cats) => (this.categories = cats));
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    const params: ProductListParams = {};
    if (this.categoryId != null) params.category = this.categoryId;
    if (this.minPrice != null) params.minPrice = this.minPrice;
    if (this.maxPrice != null) params.maxPrice = this.maxPrice;
    if (this.sort) params.sort = this.sort;
    this.productsService.getProducts(params).subscribe({
      next: (list) => (this.products = list),
      error: () => (this.products = []),
      complete: () => (this.loading = false),
    });
  }

  onCategoryChange(id: number | null): void {
    this.categoryId = id;
    this.loadProducts();
  }

  onSortChange(sort: ProductListParams['sort']): void {
    this.sort = sort;
    this.loadProducts();
  }

  addToCart(productId: number): void {
    this.cartService.addItem(productId, 1).subscribe({
      next: () => {},
      error: () => {},
    });
  }

  productImage(product: Product): string {
    const images = product.images;
    if (Array.isArray(images) && images.length) return images[0];
    if (typeof images === 'string') {
      try {
        const arr = JSON.parse(images);
        return Array.isArray(arr) && arr.length ? arr[0] : '';
      } catch {
        return images;
      }
    }
    return 'https://via.placeholder.com/600x800.png?text=Frame';
  }

  productTags(product: Product): string[] {
    const t = product.tags;
    if (Array.isArray(t)) return t;
    if (typeof t === 'string') {
      try {
        const arr = JSON.parse(t);
        return Array.isArray(arr) ? arr : [];
      } catch {
        return [];
      }
    }
    return [];
  }
}
