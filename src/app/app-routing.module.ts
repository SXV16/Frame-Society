import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ProductComponent } from './features/product/product.component';
import { GenresComponent } from './features/genres/genres.component';
import { SuggestionComponent } from './features/suggestion/suggestion.component';
import { LandingpageComponent } from './features/landingpage/landingpage.component';
import { CartComponent } from './features/cart/cart.component';
import { AdultsSectionComponent } from './features/adults-section/adults-section.component';

const routes: Routes = [
  { path: '', component: LandingpageComponent },
  // { path: 'home', component:  HomeComponent },
  { path: 'store', component: HomeComponent },
  { path: 'genres', component: GenresComponent },
  { path: 'suggestion', component: SuggestionComponent },
  { path: 'cart', component: CartComponent },
  { path: 'store/product', component: ProductComponent },
  {path: 'adult', component: AdultsSectionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
