import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order, CreateOrderResponse } from '../models/order.model';
import { CART_SESSION_KEY } from '../constants/storage-keys';

/** Creates an order from the current cart and fetches order details. */
@Injectable({ providedIn: 'root' })
export class OrdersService {
  constructor(private http: HttpClient) {}

  private getSessionId(): string {
    return localStorage.getItem(CART_SESSION_KEY) ?? 'default-session';
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ 'x-session-id': this.getSessionId() });
  }

  createOrder(userId?: number): Observable<CreateOrderResponse> {
    const body: { session_id: string; user_id?: number } = {
      session_id: this.getSessionId(),
    };
    if (userId != null) body.user_id = userId;
    return this.http.post<CreateOrderResponse>(
      `${environment.apiBaseUrl}/orders`,
      body,
      { headers: this.getHeaders() }
    );
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${environment.apiBaseUrl}/orders/${id}`);
  }
}
