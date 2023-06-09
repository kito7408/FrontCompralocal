import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import { YouTubePlayerModule } from "@angular/youtube-player";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgCulqiModule } from 'ng-culqi';
//Social media logins
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ProductsComponent } from './products/products.component';
import { HomeComponent, SafeHtmlPipe } from './home/home.component';
import { ProdDetailComponent } from './prod-detail/prod-detail.component';
import { CartComponent } from './cart/cart.component';
import { SupplierComponent } from './supplier/supplier.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { HowWorksComponent } from './how-works/how-works.component';
import { BlogComponent } from './blog/blog.component';
import { PostComponent } from './post/post.component';
import { SuccErrMesagesComponent } from './succ-err-mesages/succ-err-mesages.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { PlansComponent } from './plans/plans.component';
import { PlanDetailComponent } from './plan-detail/plan-detail.component';


let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("342981813526-m5ngo068rsrbdca73olnjshl5fa3al6g.apps.googleusercontent.com")
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("1064774420631803")
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    ProductsComponent,
    HomeComponent,
    ProdDetailComponent,
    CartComponent,
    SupplierComponent,
    OrdersComponent,
    OrderDetailComponent,
    HowWorksComponent,
    BlogComponent,
    PostComponent,
    SafeHtmlPipe,
    SuccErrMesagesComponent,
    WelcomeComponent,
    PlansComponent,
    PlanDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'http://maps.google.com/maps/api/js?sensor=false'
    }),
    SocialLoginModule,
    YouTubePlayerModule,
    NgCulqiModule
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
