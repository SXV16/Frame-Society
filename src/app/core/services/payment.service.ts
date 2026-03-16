import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaymentPayload, PaymentResponse } from '../models/payment.model';

/** Sends payment to the API (demo mode: no real charge). */
@Injectable({ providedIn: 'root' })
export class PaymentService {
  constructor(private http: HttpClient) {}

  pay(payload: PaymentPayload): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(
      `${environment.apiBaseUrl}/payments`,
      payload
    );
  }
}
