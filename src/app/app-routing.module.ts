import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ProductComponent } from './features/product/product.component';
import { GenresComponent } from './features/genres/genres.component';
import { SuggestionComponent } from './features/suggestion/suggestion.component';
import { LandingpageComponent } from './features/landingpage/landingpage.component';
import { CartComponent } from './features/cart/cart.component';

const routes: Routes = [
  { path: '', component: LandingpageComponent },
  { path: 'home', component:  LandingpageComponent },
  { path: 'store', component: HomeComponent },
  { path: 'genres', component: GenresComponent },
  { path: 'suggestion', component: SuggestionComponent },
  { path: 'cart', component: CartComponent },
  { path: 'store/product', component: ProductComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
