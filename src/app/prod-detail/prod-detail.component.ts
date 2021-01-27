import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductGet } from '../classes/productGet';
import { ProductPost } from '../classes/productPost';
import { User } from '../classes/user';
import { CartPost } from '../classes/cartPost';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { CartGet } from '../classes/cartGet';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-prod-detail',
  templateUrl: './prod-detail.component.html',
  styleUrls: ['./prod-detail.component.css']
})
export class ProdDetailComponent implements OnInit {

  producto: ProductGet;
  prodId: number;
  stringTitle: string;
  // user: User;
  carritoItem = new CartPost;
  // cartLocal: CartGet[];
  isInHome: boolean;
  successAlert: boolean;
  successMessage: string;
  errorAlert: boolean;
  errorMessage: string;

  constructor(
    private route: ActivatedRoute,
    private routes: Router,
    private prodService: ProductService,
    public cartService: CartService,
    public userService: UserService
  ) {
    this.stringTitle = '';
    this.carritoItem.quantity = 1;
    if (localStorage.getItem('user')) {
      this.userService.userInfo = JSON.parse(localStorage.getItem('user'));
    }
    if (localStorage.getItem('cartLocal')) {
      this.cartService.cartInfo = JSON.parse(localStorage.getItem('cartLocal'));
    }

    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.prodId = params['id'];
      } else {
        this.prodId = 1;
      }
      this.prodService.getById(this.prodId).subscribe((data) => {
        this.updateInfo(data);
      });
    });

    if (this.routes.url == '/home') {
      // console.log(this.router.url);
      this.isInHome = true;
    }
  }

  ngOnInit() {
  }

  updateInfo(prodData: ProductGet) {
    this.producto = prodData;
    this.stringTitle = prodData.category.name + ' > ' + prodData.name;
    this.updatePrecioTotal();
  }

  updatePrecioTotal() {
    if (this.carritoItem.quantity > 0) {
      this.carritoItem.totalPrice = this.producto.price * this.carritoItem.quantity;
    }
  }

  addToCart() {
    if (this.carritoItem.quantity > 0) {
      if (this.userService.userInfo) {
        this.carritoItem.userId = this.userService.userInfo.id;
        this.carritoItem.productId = this.prodId;
        this.carritoItem.isBuyed = false;

        this.cartService.save(this.carritoItem).subscribe((data) => {
          this.cartService.getByUserId(this.userService.userInfo.id).subscribe((data) => {
            this.cartService.cartInfo = data;
            this.cartService.cartQuantity = 0;
            this.cartService.cartTotalPrice = 0;
            this.cartService.cartInfo.forEach(element => {
              this.cartService.cartQuantity += element.quantity;
              this.cartService.cartTotalPrice += element.totalPrice;
            });
            this.successEvent('Producto agregado al carrito');
          }, (err) => {
            this.errorEvent('No se pudo agregar el producto al carrito');
          });
        }, (err) => {
          this.errorEvent('No se pudo agregar el producto al carrito');
        });

      } else {
        if (this.cartService.cartInfo.find(x => x.productId === this.prodId)) {
          this.cartService.cartInfo.find(x => x.productId === this.prodId).quantity += this.carritoItem.quantity;
          this.cartService.cartInfo.find(x => x.productId === this.prodId).totalPrice += this.carritoItem.totalPrice;
        } else {
          var cartL = new CartGet;
          cartL.quantity = this.carritoItem.quantity;
          cartL.totalPrice = this.carritoItem.totalPrice;
          cartL.isBuyed = false;
          cartL.productId = this.prodId;
          cartL.product = this.producto;

          this.cartService.cartInfo.push(cartL);
        }

        this.cartService.cartQuantity = 0;
        this.cartService.cartTotalPrice = 0;
        this.cartService.cartInfo.forEach(element => {
          this.cartService.cartQuantity += element.quantity;
          this.cartService.cartTotalPrice += element.totalPrice;
        });

        localStorage.setItem('cartLocal', JSON.stringify(this.cartService.cartInfo));
        this.successEvent('Producto agregado al carrito');

      }
    }
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
