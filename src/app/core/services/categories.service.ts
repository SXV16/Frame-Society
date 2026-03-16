import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category } from '../models/category.model';

/** Fetches categories (e.g. Anime, Cinema) for the store filters. */
@Injectable({ providedIn: 'root' })
export class CategoriesService {
  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiBaseUrl}/categories`);
  }
}
