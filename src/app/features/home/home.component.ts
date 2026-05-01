import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  allProducts: Product[] = [];
  categories: Category[] = [];
  loading = true;
  sort: ProductListParams['sort'] = undefined;
  categoryId: number | null = null;
  minPrice: number = 0;
  maxPrice: number = 500;
  isSortOpen = false;
  selectedSize: string | null = null;
  sizeOptions = ['4x6', '5x7', '8x10', '11x14', '16x20', '18x24', '24x36'];
  searchQuery: string | null = null;

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe((cats) => {
      this.categories = cats;
      this.products = this.applySearchFilter(this.allProducts);
      this.cdr.markForCheck();
    });
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.categoryId = Number(params['category']);
      } else {
        this.categoryId = null;
      }
      this.searchQuery = params['search'] || null;
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.cdr.markForCheck();
    const params: ProductListParams = {};
    if (this.categoryId != null) params.category = this.categoryId;
    if (this.minPrice != null) params.minPrice = this.minPrice;
    if (this.maxPrice != null && this.maxPrice < 500) params.maxPrice = this.maxPrice;
    if (this.selectedSize != null) params.size = this.selectedSize;
    if (this.sort) params.sort = this.sort;
    if (this.searchQuery) params.search = this.searchQuery;
    
    this.productsService.getProducts(params).subscribe({
      next: (list) => {
        this.allProducts = list;
        this.products = this.applySearchFilter(list);
        this.cdr.markForCheck();
      },
      error: () => {
        this.allProducts = [];
        this.products = [];
        this.cdr.markForCheck();
      },
      complete: () => {
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onCategoryChange(id: number | null): void {
    this.categoryId = id;
    this.loadProducts();
  }

  onSortChange(): void {
    if ((this.sort as any) === '') this.sort = undefined;
    this.loadProducts();
  }

  toggleSort(): void {
    this.isSortOpen = !this.isSortOpen;
    this.cdr.markForCheck();
  }

  selectSort(sortOption: ProductListParams['sort']): void {
    this.sort = sortOption;
    this.isSortOpen = false;
    this.loadProducts();
  }

  onSizeChange(size: string | null): void {
    if (this.selectedSize === size) {
      this.selectedSize = null;
    } else {
      this.selectedSize = size;
    }
    this.loadProducts();
  }

  onPriceChange(): void {
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
    // Return a highly optimized local asset to guarantee instant load times and bypass LCP server blocks 
    return '/assets/categories/gaming-collection.png';
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

  productSizes(product: Product): string[] {
    const s = product.sizes;
    if (Array.isArray(s)) return s;
    if (typeof s === 'string') {
      try {
        const arr = JSON.parse(s);
        return Array.isArray(arr) ? arr : [];
      } catch {
        return [];
      }
    }
    return [];
  }

  private applySearchFilter(products: Product[]): Product[] {
    const query = this.normalizeSearchText(this.searchQuery);
    if (!query) {
      return products;
    }

    const queryTokens = query.split(' ').filter(Boolean);

    return products.filter((product) => {
      const searchableParts = [
        product.title,
        product.description ?? '',
        product.posted_by_name ?? '',
        ...this.productTags(product),
        ...this.productSizes(product),
        this.categoryName(product.category_id),
      ];

      const searchableText = this.normalizeSearchText(searchableParts.join(' '));
      if (!searchableText) {
        return false;
      }

      if (searchableText.includes(query)) {
        return true;
      }

      const searchableWords = searchableText.split(' ').filter(Boolean);
      return queryTokens.every((token) =>
        searchableWords.some((word) => word.includes(token) || token.includes(word))
      );
    });
  }

  private categoryName(categoryId: number | null): string {
    if (categoryId == null) {
      return '';
    }

    return this.categories.find((category) => category.id === categoryId)?.name ?? '';
  }

  private normalizeSearchText(value: string | null): string {
    return (value ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }
}
