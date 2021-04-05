import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogComponent } from './blog/blog.component';
import { CartComponent } from './cart/cart.component';
import { HomeComponent } from './home/home.component';
import { HowWorksComponent } from './how-works/how-works.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrdersComponent } from './orders/orders.component';
import { PlanDetailComponent } from './plan-detail/plan-detail.component';
import { PlansComponent } from './plans/plans.component';
import { PostComponent } from './post/post.component';
import { ProdDetailComponent } from './prod-detail/prod-detail.component';
import { ProductsComponent } from './products/products.component';
import { SupplierComponent } from './supplier/supplier.component';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent },
  { path: 'home', component: HomeComponent },
  { path: 'products/:id', component: ProdDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'fuerza/:name', component: SupplierComponent },
  { path: 'nuevo-socio/:token', component: SupplierComponent },
  { path: 'educacion', component: SupplierComponent },
  { path: 'reforestacion', component: SupplierComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'orders/:id', component: OrderDetailComponent },
  { path: 'como-funciona', component: HowWorksComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'post/:id', component: PostComponent },
  { path: 'ventajas', component: PlansComponent },
  { path: 'ventajas/socio', component: PlanDetailComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },

  // {path: '', component: WelcomeComponent},
  // { path: '**', redirectTo: ''},

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy', scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
