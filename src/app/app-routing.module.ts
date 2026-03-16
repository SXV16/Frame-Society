import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ProductComponent } from './features/product/product.component';
import { GenresComponent } from './features/genres/genres.component';
import { SuggestionComponent } from './features/suggestion/suggestion.component';
import { LandingpageComponent } from './features/landingpage/landingpage.component';
import { CartComponent } from './features/cart/cart.component';
import { AdultsSectionComponent } from './features/adults-section/adults-section.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AdminProductsComponent } from './features/admin/admin-products/admin-products.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: '', component: LandingpageComponent },
  { path: 'store', component: HomeComponent },
  { path: 'store/product/:id', component: ProductComponent },
  { path: 'genres', component: GenresComponent },
  { path: 'suggestion', component: SuggestionComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', redirectTo: 'admin/products', pathMatch: 'full' },
  { path: 'admin/products', component: AdminProductsComponent, canActivate: [AdminGuard] },
  { path: 'adult', component: AdultsSectionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
