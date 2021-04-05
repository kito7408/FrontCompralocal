import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductGet } from '../classes/productGet';
import { ProductPost } from '../classes/productPost';
import { User } from '../classes/user';
import { CartPost } from '../classes/cartPost';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { CartGet } from '../classes/cartGet';
import { UserService } from '../services/user.service';
import { SuccErrMesagesComponent } from '../succ-err-mesages/succ-err-mesages.component';
import { ProdCommentGet, ProdCommentPost } from '../classes/prodComment';
import { ProdCommentService } from '../services/prod-comment.service';
import * as moment from 'moment';
import { ProdMod } from '../classes/prodModel';

@Component({
  selector: 'app-prod-detail',
  templateUrl: './prod-detail.component.html',
  styleUrls: ['./prod-detail.component.css']
})
export class ProdDetailComponent implements OnInit {

  producto: ProductGet;
  prodId: number;
  // user: User;
  carritoItem = new CartPost;
  priceWithoutOffer: number;
  // cartLocal: CartGet[];
  isInHome: boolean;
  isInProdDetail: boolean;
  prodAllComments: ProdCommentGet[];
  newProdComment = new ProdCommentPost;
  starArr = [1, 2, 3, 4, 5];
  numStarsPainted: number = 0;
  numStarsSelected: number = 0;
  starsSelected: boolean = false;
  avgStars: number = 0;
  pathImg: string;
  path: string = 'https://compralocal-images.s3.us-east-2.amazonaws.com/products/';
  deleting: boolean = false;
  onUpdate: boolean = false;
  fecha_entrega: string = '';
  prodModSelect: number;

  @ViewChild('alertComp') alertComp: SuccErrMesagesComponent;

  constructor(
    private route: ActivatedRoute,
    private routes: Router,
    private prodService: ProductService,
    public cartService: CartService,
    public userService: UserService,
    private prodCommentService: ProdCommentService
  ) {
    this.isInProdDetail = false;
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
        this.isInProdDetail = true;
      } else {           //para que no bote error al llamarlo al inicio de home
        this.prodId = 1;
      }
      
      this.prodService.getById(this.prodId).subscribe((data) => {
        this.producto = data;
        this.updateInfo(data);
        this.getProdCommentsByProd();
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
    
    // this.prodModSelect = this.producto.productModels[0].id;
    // this.pathImg = this.path + prodData.image1;
    this.changeImg(1);
    this.updatePrecioTotal();
  }

  updatePrecioTotal() {
    if (this.carritoItem.quantity >= 0) {
      if (this.producto.isOffer) {
        this.carritoItem.totalPrice = this.producto.priceOffer * this.carritoItem.quantity;
        this.priceWithoutOffer = this.producto.price * this.carritoItem.quantity;
      } else {
        this.carritoItem.totalPrice = this.producto.price * this.carritoItem.quantity;
      }
    }
  }

  getProdCommentsByProd() {
    this.prodCommentService.getByProductId(this.prodId).subscribe((data) => {
      this.prodAllComments = data;
      this.avgStars = 0;
      this.prodAllComments.forEach(element => {
        this.avgStars += element.stars;
      });
      if (this.prodAllComments.length > 0) {
        this.avgStars = this.avgStars / this.prodAllComments.length;
      }
      this.fecha_entrega = moment().add(2, 'days').locale('es').format('LL');
    });
  }

  addProdComment() {
    this.newProdComment.userId = this.userService.userInfo.id;
    this.newProdComment.productId = this.producto.id;
    this.newProdComment.stars = this.numStarsSelected;
    this.prodCommentService.save(this.newProdComment).subscribe((data) => {
      this.newProdComment = new ProdCommentPost;
      this.numStarsPainted = 0;
      this.numStarsSelected = 0;
      this.starsSelected = false;
      this.getProdCommentsByProd();
      this.alertComp.successEvent('Se registró tu comentario correctamente.');
    });
  }

  paintStars(numStars: number) {
    this.numStarsPainted = numStars;
  }

  leaveStars() {
    if (this.starsSelected) {
      this.numStarsPainted = this.numStarsSelected;
    } else {
      this.numStarsPainted = 0;
    }
  }

  selectStars(numStars: number) {
    this.numStarsSelected = numStars;
    this.starsSelected = true;
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
            this.alertComp.successEvent('Producto agregado al carrito');
          }, (err) => {
            this.alertComp.errorEvent('No se pudo agregar el producto al carrito');
          });
        }, (err) => {
          this.alertComp.errorEvent('No se pudo agregar el producto al carrito');
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
        this.alertComp.successEvent('Producto agregado al carrito');

      }
    }
  }

  goToSupplier(suppName: string) {
    if (this.isInProdDetail) {
      var suppLink = suppName.replace(/\s+/g, "-");
      this.routes.navigate(['/fuerza/' + suppLink]);
    }
  }

  deleteProd() {
    this.deleting = true;
    this.prodService.delete(this.producto.id).subscribe(resProdDel => {

      this.cartService.getByUserId(this.userService.userInfo.id).subscribe((data) => {
        this.cartService.cartInfo = data;
        this.cartService.cartQuantity = 0;
        this.cartService.cartTotalPrice = 0;
        this.cartService.cartInfo.forEach(element => {
          this.cartService.cartQuantity += element.quantity;
          this.cartService.cartTotalPrice += element.totalPrice;
        });
        
        this.alertComp.successEvent('El producto ha sido eliminado.');

        setTimeout(() => {
          this.deleting = false;
          this.routes.navigate(['/home']);
        }, 2000);
      }, (err) => {
        this.alertComp.errorEvent('Error al actualizar el carrito.');
      });
    }, (err) => {
      this.deleting = false;
      this.alertComp.errorEvent('Error al eliminar el producto');
    });
  }

  changeImg(imgNum: number) {
    switch (imgNum) {
      case 1:
        this.pathImg = this.path + this.producto.image1;
        break;
      case 2:
        this.pathImg = this.path + this.producto.image2;
        break;
      case 3:
        this.pathImg = this.path + this.producto.image3;
        break;
      case 4:
        this.pathImg = this.path + this.producto.image4;
        break;
      case 5:
        this.pathImg = this.path + this.producto.image5;
        break;

      default:
        break;
    }
  }

  prodToUpdate(){
    this.onUpdate = true;
  }

  selectModel(mod: ProdMod){
    this.prodModSelect = mod.id;
    this.changeImg(Number(mod.prodImgNum));
  }
}
