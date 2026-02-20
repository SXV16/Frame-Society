import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './features/home/home.component';
import { GenresComponent } from './features/genres/genres.component';
import { ProductComponent } from './features/product/product.component';
import { SuggestionComponent } from './features/suggestion/suggestion.component';
import { NavComponent } from './shared/nav/nav.component';
import { LandingpageComponent } from './features/landingpage/landingpage.component';
import { CartComponent } from './features/cart/cart.component';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
