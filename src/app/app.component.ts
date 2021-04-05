import { Component, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './navbar/navbar.component';

declare var gtag;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CompraLocal';

  compo: any;
  onlyMiddle: boolean = false;

  @ViewChild('navbarCL') navbarCL: NavbarComponent;

  constructor(
    private router: Router
  ) {
    const navEndEvents$ = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      );

    navEndEvents$.subscribe((event: NavigationEnd) => {
      gtag('config', 'G-QK19ZNYX73', {
        'page_path': event.urlAfterRedirects
      });
    });
  }

  onActivate(componentReference) {
    if (componentReference.logEvent) {
      componentReference.logEvent.subscribe(event => {
        if (event == 'login') {
          this.navbarCL.loginButton.nativeElement.click();
        }
      })
    }
    
    this.compo = componentReference;

    if (this.router.url.includes('/ventajas') || this.router.url.includes('/nuevo-socio') || this.router.url == '/') {
      // console.log(this.router.url);
      this.onlyMiddle = true;
    } else {
      this.onlyMiddle = false;
    }
  }

  emitterAction(e) {

    switch (e) {
      case 'products':
        this.compo.listProducts();
        break;

      case 'suppliers':      //cuando se agregan proveedores
        this.compo.getSuppliers();
        break;

      case 'user':
        if (this.router.url == '/cart') {
          this.compo.setUserValues();
          // this.compo.newUser = JSON.parse(localStorage.getItem('user'));
          // this.compo.getTotals();
        }
        break;
      default:
        break;
    }
  }

}
