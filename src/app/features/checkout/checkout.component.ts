import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrdersService } from '../../core/services/orders.service';
import { PaymentService } from '../../core/services/payment.service';
import { AuthService } from '../../core/services/auth.service';
import { CartItem } from '../../core/models/cart.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  form: FormGroup;
  items: CartItem[] = [];
  loading = false;
  error: string | null = null;
  success = false;
  orderId: number | null = null;
  total = 0;
  transactionId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private ordersService: OrdersService,
    private paymentService: PaymentService,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: [''],
      address: [''],
      city: [''],
      zip: [''],
      cardNumber: ['4242424242424242', [Validators.required, Validators.minLength(12)]],
      expiry: ['12/28', Validators.required],
      cvc: ['123', [Validators.required, Validators.minLength(3)]],
      cardName: ['Demo User', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cartService.getCart().subscribe((list) => {
      this.items = list;
      this.total = list.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
    });
  }

  imageUrl(item: CartItem): string {
    const img = item.images;
    if (typeof img === 'string') {
      try {
        const arr = JSON.parse(img);
        return Array.isArray(arr) && arr.length ? arr[0] : 'https://via.placeholder.com/80x80';
      } catch {
        return img || 'https://via.placeholder.com/80x80';
      }
    }
    return 'https://via.placeholder.com/80x80';
  }

  onSubmit(): void {
    if (this.form.invalid || this.items.length === 0) return;
    this.error = null;
    this.loading = true;
    const userId = this.auth.getCurrentUserSnapshot()?.id;
    this.ordersService.createOrder(userId).subscribe({
      next: (order) => {
        this.orderId = order.id;
        const last4 = this.form.value.cardNumber.slice(-4);
        this.paymentService
          .pay({
            order_id: order.id,
            amount: order.total,
            demo_last4: last4,
            demo_brand: 'demo',
          })
          .subscribe({
            next: (res) => {
              this.transactionId = res.transaction_id;
              this.success = true;
            },
            error: (err) => {
              this.loading = false;
              this.error = err.error?.error || err.message || 'Payment failed.';
            },
            complete: () => (this.loading = false),
          });
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || err.message || 'Could not create order.';
      },
    });
  }
}
