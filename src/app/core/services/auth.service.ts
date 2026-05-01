import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, LoginResponse, RegisterPayload } from '../models/user.model';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../constants/storage-keys';

/** Handles login, register, logout. Saves token and user in localStorage so the app knows who is logged in. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser$ = new BehaviorSubject<User | null>(this.getStoredUser());

  constructor(private http: HttpClient) {}

  register(payload: RegisterPayload): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiBaseUrl}/auth/register`, payload)
      .pipe(tap((res) => this.setSession(res)));
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiBaseUrl}/auth/login`, { email, password })
      .pipe(tap((res) => this.setSession(res)));
  }

  updateProfile(payload: { name?: string, bio?: string, profile_picture_url?: string }): Observable<{message: string}> {
    return this.http.put<{message: string}>(`${environment.apiBaseUrl}/users/me`, payload).pipe(
      tap(() => {
        const u = this.currentUser$.value;
        if (u) {
          const updated = { ...u, ...payload };
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));
          this.currentUser$.next(updated);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    this.currentUser$.next(null);
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  getCurrentUserSnapshot(): User | null {
    return this.currentUser$.value;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  }

  isAdmin(): boolean {
    const user = this.currentUser$.value ?? this.getStoredUser();
    return user?.role === 'admin';
  }

  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  private setSession(res: LoginResponse): void {
    localStorage.setItem(AUTH_TOKEN_KEY, res.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(res.user));
    this.currentUser$.next(res.user);
  }

  private getStoredUser(): User | null {
    try {
      const raw = localStorage.getItem(AUTH_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
