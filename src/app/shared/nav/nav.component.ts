import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  @ViewChild('searchContainer') searchContainer?: ElementRef<HTMLElement>;

  user: User | null = null;
  cartCount = 0;
  showLogoutConfirm = false;
  isStorePage = false;

  constructor(
    private auth: AuthService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.router.events.subscribe(() => {
      this.isStorePage = this.router.url.includes('/store');
    });
  }

  ngOnInit(): void {
    this.auth.getCurrentUser().subscribe((u: User | null) => (this.user = u));
    this.cartService.getCart().subscribe((items: CartItem[]) => {
      this.cartCount = items.reduce((sum: number, i: CartItem) => sum + i.quantity, 0);
    });
    // Initialize state
    this.isStorePage = this.router.url.includes('/store');

    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';

      if (params['focusSearch'] === 'true') {
        setTimeout(() => {
          const searchInput = document.getElementById('nav-search-input');
          if (searchInput) {
            searchInput.focus();
          }
        }, 300);
      }
    });
  }

  logout(): void {
    this.showLogoutConfirm = true;
  }

  confirmLogout(): void {
    this.showLogoutConfirm = false;
    this.auth.logout();
    this.router.navigate(['/']);
  }

  cancelLogout(): void {
    this.showLogoutConfirm = false;
  }

  searchQuery = '';
  showSuggestions = false;
  popularArtists = ['Sxvxge Melo', 'Raphael Studio', 'Cinema Legends'];

  onSearch(): void {
    const search = this.searchQuery.trim();
    this.router.navigate(['/store'], {
      queryParams: { search: search || null },
      queryParamsHandling: 'merge'
    });
    this.showSuggestions = false;
  }

  selectArtist(artist: string): void {
    this.searchQuery = artist;
    this.onSearch();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.showSuggestions) {
      return;
    }

    const target = event.target as Node | null;
    if (target && this.searchContainer?.nativeElement.contains(target)) {
      return;
    }

    this.showSuggestions = false;
  }
}
