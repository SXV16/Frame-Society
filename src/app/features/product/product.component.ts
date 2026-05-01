import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { Product, Review } from '../../core/models/product.model';

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

  // Review System
  reviews: Review[] = [];
  newRating = 5;
  newComment = '';
  isLoggedIn = false;
  submittingReview = false;
  hoverRating = 0;
  bottomHoverRating = 0;
  topRatingInteracted = false;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private cartService: CartService,
    private authService: AuthService
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

    this.productsService.getReviews(+id).subscribe(
      (revs) => (this.reviews = revs)
    );

    this.isLoggedIn = this.authService.isLoggedIn();
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

  submitReview(): void {
    if (!this.product || !this.isLoggedIn) return;
    const currentProductId = this.product.id;
    this.submittingReview = true;
    this.productsService.submitReview(currentProductId, { rating: this.newRating, comment: this.newComment }).subscribe({
      next: (res) => {
        // Update local object to reflect exact calculated average from response!
        if (this.product) {
          this.product.rating = res.newRating;
          this.product.reviews_count = res.newCount;
        }
        // Reload reviews feed
        this.productsService.getReviews(currentProductId).subscribe((revs) => {
          this.reviews = revs;
        });
        // Clear input form
        this.newComment = '';
        this.newRating = 5;
        this.submittingReview = false;
      },
      error: () => {
        this.submittingReview = false;
        alert('Failed to submit review. Try again.');
      }
    });
  }

  setTopRating(rating: number): void {
    if (!this.isLoggedIn) {
       alert("Please login to leave a review.");
       return;
    }
    this.newRating = rating;
    this.topRatingInteracted = true;
    this.scrollToReviews();
  }

  scrollToReviews(): void {
    const el = document.getElementById('reviews-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
