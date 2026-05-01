import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductListParams, Review } from '../models/product.model';

/** Fetches products from the API. Used by the store and product detail pages. */
@Injectable({ providedIn: 'root' })
export class ProductsService {
  constructor(private http: HttpClient) {}

  getProducts(params?: ProductListParams): Observable<Product[]> {
    let httpParams = new HttpParams();
    if (params?.category != null) {
      httpParams = httpParams.set('category', params.category.toString());
    }
    if (params?.minPrice != null) {
      httpParams = httpParams.set('minPrice', params.minPrice.toString());
    }
    if (params?.maxPrice != null) {
      httpParams = httpParams.set('maxPrice', params.maxPrice.toString());
    }
    if (params?.sort) {
      httpParams = httpParams.set('sort', params.sort);
    }
    if (params?.size) {
      httpParams = httpParams.set('size', params.size);
    }
    if (params?.search) {
      httpParams = httpParams.set('search', params.search);
    }
    return this.http.get<Product[]>(`${environment.apiBaseUrl}/products`, {
      params: httpParams,
    });
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${environment.apiBaseUrl}/products/${id}`);
  }

  createProduct(product: Partial<Product>): Observable<{ id: number; message: string }> {
    return this.http.post<{ id: number; message: string }>(
      `${environment.apiBaseUrl}/products`,
      product
    );
  }

  updateProduct(id: number, product: Partial<Product>): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${environment.apiBaseUrl}/products/${id}`,
      product
    );
  }

  deleteProduct(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${environment.apiBaseUrl}/products/${id}`
    );
  }

  getReviews(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${environment.apiBaseUrl}/products/${productId}/reviews`);
  }

  submitReview(productId: number, payload: { rating: number; comment: string }): Observable<{ message: string; newRating: number; newCount: number }> {
    return this.http.post<{ message: string; newRating: number; newCount: number }>(
      `${environment.apiBaseUrl}/products/${productId}/reviews`,
      payload
    );
  }
}
