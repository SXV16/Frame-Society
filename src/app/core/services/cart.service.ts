import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CartItem } from '../models/cart.model';
import { CART_SESSION_KEY } from '../constants/storage-keys';

function getOrCreateSessionId(): string {
  let id = localStorage.getItem(CART_SESSION_KEY);
  if (!id) {
    id = 'sess_' + Math.random().toString(36).slice(2, 15) + Date.now();
    localStorage.setItem(CART_SESSION_KEY, id);
  }
  return id;
}

/** Cart is tied to a session ID (stored in localStorage). Add/update/remove items and refresh the list from the API. */
@Injectable({ providedIn: 'root' })
export class CartService {
  private sessionId = getOrCreateSessionId();
  private cart$ = new BehaviorSubject<CartItem[]>([]);

  constructor(private http: HttpClient) {
    this.refreshCart();
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ 'x-session-id': this.sessionId });
  }

  getCart(): Observable<CartItem[]> {
    return this.cart$.asObservable();
  }

  getCartSnapshot(): CartItem[] {
    return this.cart$.value;
  }

  getCartCount(): number {
    return this.cart$.value.reduce((sum, item) => sum + item.quantity, 0);
  }

  refreshCart(): void {
    this.http
      .get<CartItem[]>(`${environment.apiBaseUrl}/cart`, {
        headers: this.getHeaders(),
      })
      .subscribe((items) => this.cart$.next(items));
  }

  addItem(productId: number, quantity: number, size?: string): Observable<unknown> {
    return this.http
      .post(
        `${environment.apiBaseUrl}/cart`,
        { product_id: productId, quantity, size, session_id: this.sessionId },
        { headers: this.getHeaders() }
      )
      .pipe(tap(() => this.refreshCart()));
  }

  updateItem(cartItemId: number, quantity?: number, size?: string): Observable<unknown> {
    const body: { quantity?: number; size?: string } = {};
    if (quantity !== undefined) body.quantity = quantity;
    if (size !== undefined) body.size = size;
    return this.http
      .put(`${environment.apiBaseUrl}/cart/${cartItemId}`, body, {
        headers: this.getHeaders(),
      })
      .pipe(tap(() => this.refreshCart()));
  }

  removeItem(cartItemId: number): Observable<unknown> {
    return this.http
      .delete(`${environment.apiBaseUrl}/cart/${cartItemId}`, {
        headers: this.getHeaders(),
      })
      .pipe(tap(() => this.refreshCart()));
  }

  getSessionId(): string {
    return this.sessionId;
  }
}
