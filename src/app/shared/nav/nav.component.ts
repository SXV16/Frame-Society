import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { User } from '../../core/models/user.model';
import { CartItem } from '../../core/models/cart.model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  user: User | null = null;
  cartCount = 0;

  constructor(
    private auth: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.auth.getCurrentUser().subscribe((u: User | null) => (this.user = u));
    this.cartService.getCart().subscribe((items: CartItem[]) => {
      this.cartCount = items.reduce((sum: number, i: CartItem) => sum + i.quantity, 0);
    });
  }

  logout(): void {
    this.auth.logout();
  }
}
