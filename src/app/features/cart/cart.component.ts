import { Component, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/cart.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  loading = true;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe((list) => (this.items = list));
    this.cartService.refreshCart();
    this.loading = false;
  }

  get subtotal(): number {
    return this.items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
  }

  imageUrl(item: CartItem): string {
    const img = item.images;
      try {
        const arr = JSON.parse(img || '[]');
        return Array.isArray(arr) ? arr[0] : arr;
      } catch {
        return img || 'https://via.placeholder.com/150x200';
      }
  }

  updateQty(item: CartItem, delta: number): void {
    const newQty = Math.max(1, item.quantity + delta);
    this.cartService.updateItem(item.id, newQty).subscribe();
  }

  remove(item: CartItem): void {
    this.cartService.removeItem(item.id).subscribe();
  }
}
