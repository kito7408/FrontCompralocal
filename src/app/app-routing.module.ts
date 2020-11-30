import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { HomeComponent } from './home/home.component';
import { ProdDetailComponent } from './prod-detail/prod-detail.component';
import { ProductsComponent } from './products/products.component';
import { SupplierComponent } from './supplier/supplier.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent },
  { path: 'home', component: HomeComponent },
  { path: 'products/:id', component: ProdDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'supplier/:id', component: SupplierComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
