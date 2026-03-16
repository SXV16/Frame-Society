import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './features/home/home.component';
import { GenresComponent } from './features/genres/genres.component';
import { ProductComponent } from './features/product/product.component';
import { SuggestionComponent } from './features/suggestion/suggestion.component';
import { NavComponent } from './shared/nav/nav.component';
import { LandingpageComponent } from './features/landingpage/landingpage.component';
import { CartComponent } from './features/cart/cart.component';
import { AdultsSectionComponent } from './features/adults-section/adults-section.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AdminProductsComponent } from './features/admin/admin-products/admin-products.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { ApiInterceptor } from './core/interceptors/api.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LandingpageComponent,
    HomeComponent,
    GenresComponent,
    ProductComponent,
    SuggestionComponent,
    NavComponent,
    CartComponent,
    AdultsSectionComponent,
    LoginComponent,
    RegisterComponent,
    AdminProductsComponent,
    CheckoutComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
