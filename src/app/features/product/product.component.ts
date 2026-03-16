import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  quantity = 1;
  selectedSize: string | null = null;
  addSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.productsService.getProduct(+id).subscribe({
      next: (p) => {
        this.product = p;
        const sizes = this.parseSizes(p.sizes);
        if (sizes.length) this.selectedSize = sizes[0];
      },
      error: () => (this.product = null),
      complete: () => (this.loading = false),
    });
  }

  parseSizes(sizes: Product['sizes']): string[] {
    if (Array.isArray(sizes)) return sizes;
    if (typeof sizes === 'string') {
      try {
        const arr = JSON.parse(sizes);
        return Array.isArray(arr) ? arr : [];
      } catch {
        return [];
      }
    }
    return [];
  }

  productImage(): string {
    if (!this.product) return '';
    const images = this.product.images;
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

  decrementQty(): void {
    this.quantity = Math.max(1, this.quantity - 1);
  }

  addToCart(): void {
    if (!this.product) return;
    this.cartService.addItem(this.product.id, this.quantity, this.selectedSize ?? undefined).subscribe({
      next: () => {
        this.addSuccess = true;
        setTimeout(() => (this.addSuccess = false), 3000);
      },
      error: () => {},
    });
  }
}
