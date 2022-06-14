import { Component, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AlpacaNavbarComponent } from './alpaca-navbar/alpaca-navbar.component';
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

  // @ViewChild('navbarCL') navbarCL: NavbarComponent;
  @ViewChild('navbarCL') navbarCL: AlpacaNavbarComponent;

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
        else if (event.includes('newProdFromSupp')) {
          var suppSelectedId = event.split(' ')[1];
          this.navbarCL.newProdF();
          this.navbarCL.newProduct.supplierId = Number(suppSelectedId);
          this.navbarCL.suppSelected = true;
        }
        else if (event == 'unableSupp') {
          this.navbarCL.updateCart();
        }
      });
    }

    if (componentReference.userEvent) {
      componentReference.userEvent.subscribe(event => {

        switch (event) {
          case 'register':
            this.navbarCL.registerButton.nativeElement.click();
            break;

          case 'login':
            let userToLog = JSON.parse(localStorage.getItem('userToLog'));
            localStorage.removeItem('userToLog');

            this.navbarCL.newUser.email = userToLog.user;
            this.navbarCL.newUser.password = userToLog.pass;
            this.navbarCL.login();
            break;

          case 'logout':
            this.navbarCL.logoutButton.nativeElement.click();
            break;

          case 'myOrds':
            this.navbarCL.listMyOrdsButton.nativeElement.click();
            break;

          case 'addProd':
            this.navbarCL.addProdButton.nativeElement.click();
            break;

          case 'addUser':
            this.navbarCL.addUserButton.nativeElement.click();
            break;

          case 'allOrds':
            this.navbarCL.listOrdsButton.nativeElement.click();
            break;

          default:
            break;
        }

        // if (event == 'register') {
        //   this.navbarCL.registerButton.nativeElement.click();
        // }
        // else if (event == 'login') {
        //   let userToLog = JSON.parse(localStorage.getItem('userToLog'));
        //   localStorage.removeItem('userToLog');

        //   this.navbarCL.newUser.email = userToLog.user;
        //   this.navbarCL.newUser.password = userToLog.pass;
        //   this.navbarCL.login();
        // }
      });
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
    console.log("casi", e);


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
