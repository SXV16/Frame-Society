import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

/** Protects routes: only lets the user in if they are logged in. Otherwise redirects to login. */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.auth.isLoggedIn()) return true;
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
