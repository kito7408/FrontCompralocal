import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProductGet } from '../classes/productGet';
import { User } from '../classes/user';
import { CartGet } from '../classes/cartGet';
import { CartPost } from '../classes/cartPost';
import { CartService } from '../services/cart.service';
import { UserService } from '../services/user.service';
declare var Culqi: any;
declare var culqi_aux: any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  // carritoList: CartGet[];
  user: User;
  helper: string;
  // cantOriginal: number[];
  // @Output() cartEvent = new EventEmitter;

  constructor(
    public cartService: CartService,
    private userService: UserService
  ) {
    Culqi.publicKey = "pk_test_20064752bb0ebab1";
    this.user = JSON.parse(localStorage.getItem('user'));
    this.listCarrito();
  }

  ngOnInit() {
    console.log(culqi_aux);
    console.log(Culqi);
    
    // this.cartService.someChange.subscribe((result) => {
    //   console.log("test", result);
    // })

    // Culqi.options({
    //   lang: 'auto',
    //   modal: false,
    //   installments: true,
    //   customButton: 'Donar',
    //   style: {
    //     logo: 'https://culqi.com/LogoCulqi.png',
    //     maincolor: '#0ec1c1',
    //     buttontext: '#ffffff',
    //     maintext: '#4A4A4A',
    //     desctext: '#4A4A4A'
    //   }
    // });
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
    if (this.user) {
      this.cartService.getByUserId(this.user.id).subscribe((data) => {
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
    if (this.user) {
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
    if (this.user) {
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

  pagar(e) {

    Culqi.settings({
      title: 'CompraLocal',
      currency: 'PEN',
      description: 'Articulos varios',
      amount: this.cartService.cartTotalPrice * 100
    });

    Culqi.open();
    e.preventDefault();

  }

  culqi_next(){
    console.log(Culqi);
    
    console.log(culqi_aux);
    
  }
}
