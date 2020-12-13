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
      this.prodId = params['id'];
      this.prodService.getById(this.prodId).subscribe((data) => {
        this.producto = data;
        this.stringTitle = data.category.name + ' > ' + data.name;
        this.updatePrecioTotal();
      });
    });
  }

  ngOnInit() {
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
          this.routes.navigate(['/cart']);
        });

      } else {
        if(this.cartService.cartInfo.find(x => x.productId === this.prodId)){
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
        
        localStorage.setItem('cartLocal', JSON.stringify(this.cartService.cartInfo));
        this.routes.navigate(['/cart']);
      }
    }
  }

}
