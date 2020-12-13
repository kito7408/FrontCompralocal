import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ProductGet } from '../classes/productGet';
import { User } from '../classes/user';
import { CartGet } from '../classes/cartGet';
import { CartPost } from '../classes/cartPost';
import { CartService } from '../services/cart.service';
import { UserService } from '../services/user.service';
import { Tarjeta } from '../classes/tarjeta';
import { Router } from '@angular/router';
import { isNgTemplate } from '@angular/compiler';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  // carritoList: CartGet[];
  // user: User;
  helper: string;
  charging: boolean;
  tarjeta = new Tarjeta;
  paying: boolean;
  @ViewChild('closeModaPayment') closeModaPayment: ElementRef;
  successAlert: boolean;
  successMessage: string;
  errorAlert: boolean;
  errorMessage: string;
  // cantOriginal: number[];
  // @Output() cartEvent = new EventEmitter;

  constructor(
    public cartService: CartService,
    private routes: Router,
    public userService: UserService,
    private productService: ProductService
  ) {
    this.charging = false;
    this.paying = false;
    if (localStorage.getItem('user')) {
      this.userService.userInfo = JSON.parse(localStorage.getItem('user'));
    }
    this.listCarrito();
  }

  ngOnInit() {
  }

  getTotals() {
    this.cartService.cartQuantity = 0;
    this.cartService.cartTotalPrice = 0;
    this.cartService.cartInfo.forEach(element => {
      this.cartService.cartQuantity += element.quantity;
      this.cartService.cartTotalPrice += element.totalPrice;
    });
  }



  listCarrito() {
    // this.cantOriginal = [];
    if (this.userService.userInfo) {
      this.cartService.getByUserId(this.userService.userInfo.id).subscribe((data) => {
        this.cartService.cartInfo = data;
        this.getTotals();
        // data.forEach(element => {
        //   this.cantOriginal.push(element.quantity);
        // });
      });
    } else {
      if (localStorage.getItem('cartLocal')) {
        this.cartService.cartInfo = JSON.parse(localStorage.getItem('cartLocal'));
      }
      this.getTotals();
      // this.cartService.cartInfo.forEach(element => {
      //   this.cantOriginal.push(element.quantity);
      // });
    }
  }

  menosCantidad(productId: number) {
    this.cartService.cartInfo.find(x => x.productId === productId).quantity -= 1;
    this.calcPrecioTotal(productId);
    this.updateItem(this.cartService.cartInfo.find(x => x.productId === productId));
  }

  masCantidad(productId: number) {
    this.cartService.cartInfo.find(x => x.productId === productId).quantity += 1;
    this.calcPrecioTotal(productId);
    this.updateItem(this.cartService.cartInfo.find(x => x.productId === productId));
  }

  calcPrecioTotal(productId: number) {
    this.cartService.cartInfo.find(x => x.productId === productId).totalPrice = this.cartService.cartInfo.find(x => x.productId === productId).quantity * this.cartService.cartInfo.find(x => x.productId === productId).product.price;
  }

  deleteItem(item: CartGet) {
    if (this.userService.userInfo) {
      this.cartService.delete(item.id).subscribe((data) => {
        this.listCarrito();
        // this.cartEvent.emit(null);
      });
    } else {
      const index = this.cartService.cartInfo.indexOf(item);
      this.cartService.cartInfo.splice(index, 1);
      localStorage.setItem('cartLocal', JSON.stringify(this.cartService.cartInfo));
      this.listCarrito();
      // this.cartEvent.emit(null);
    }
  }

  updateItem(item: CartGet) {
    if (this.userService.userInfo) {
      const itemToUpdate = new CartPost;
      itemToUpdate.quantity = item.quantity;
      itemToUpdate.id = item.id;
      itemToUpdate.totalPrice = item.totalPrice;
      itemToUpdate.productId = item.productId;
      itemToUpdate.userId = item.userId;

      this.cartService.update(itemToUpdate).subscribe((data) => {
        this.listCarrito();
        // this.cartEvent.emit(null);
      });
    } else {
      localStorage.setItem('cartLocal', JSON.stringify(this.cartService.cartInfo));
      this.listCarrito();
      // this.cartEvent.emit(null);
    }
  }

  // pagar(e) {

  //   Culqi.settings({
  //     title: 'CompraLocal',
  //     currency: 'PEN',
  //     description: 'Articulos varios',
  //     amount: this.cartService.cartTotalPrice * 100
  //   });

  //   Culqi.open();
  //   e.preventDefault();

  //   console.log('culqi next');
    
  // }

  enviarInfoTarjeta(){
    this.paying = true;
    this.tarjeta.expiration_year = "20" + this.tarjeta.expiration_year;
    this.cartService.sendToCulqi(this.tarjeta).subscribe((dataToken) => {
      // console.log("info culqi token",dataToken);
      var infoCargo = {
        amount: this.cartService.cartTotalPrice * 100,
        currency_code: 'PEN',
        email: dataToken.email,
        source_id: dataToken.id
      }
      this.cartService.crearCargo(infoCargo).subscribe((dataCargo) => {
        // console.log("cargo creado correctamente", dataCargo);
        // alert("cargo creado correctamente")
        this.updateProdSales();
        this.limpiarCarrito();
      }, (error) => {
        console.log(error);
        this.errorEvent("Hubo un problema al realizar el pago.")
      });
    }, (err) => {
      console.log(err);
      this.errorEvent("Hubo un problema al realizar el pago.")
    });
  }

  limpiarCarrito(){
    this.cartService.clearCart(this.userService.userInfo.id).subscribe((data) => {
      this.successAlert = true;
      this.successMessage = "El pago se realizó con exito.";
      setTimeout(() => {
        this.successAlert = false;
        this.successMessage = '';
        this.paying = false;
        this.tarjeta = new Tarjeta;
        this.cartService.cartInfo = [];
        this.cartService.cartQuantity = 0;
        this.cartService.cartTotalPrice = 0;
        this.closeModaPayment.nativeElement.click();
        this.routes.navigate(['/']);
      }, 3000);
    })
  }

  updateProdSales(){
    var prodsInfo = [];
    this.cartService.cartInfo.forEach(item => {
      var itemInfo = {
        prodId: item.productId,
        cant: item.quantity
      };
      prodsInfo.push(itemInfo);
    });
    this.productService.updateSales(prodsInfo);
  }

  successEvent(msg: string) {
    this.successAlert = true;
    this.successMessage = msg;
    setTimeout(() => {
      this.successAlert = false;
      this.successMessage = '';
    }, 3000);
  }

  errorEvent(msg: string) {
    this.errorAlert = true;
    this.errorMessage = msg
    setTimeout(() => {
      this.errorAlert = false;
      this.errorMessage = '';
    }, 3000);
  }
}
