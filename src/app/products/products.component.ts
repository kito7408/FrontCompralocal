import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CartGet } from '../classes/cartGet';
import { CartPost } from '../classes/cartPost';
import { ProductGet } from '../classes/productGet';
import { ProductPost } from '../classes/productPost';
import { User } from '../classes/user';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';
import { UserService } from '../services/user.service';
import { ProdDetailComponent } from '../prod-detail/prod-detail.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  productos: any;
  prodPerPage: number = 10;
  // prodOnPage: any;
  // actualPage: number;
  // numberOfPages: number;
  filterString: string;
  searching: boolean;
  noProds: boolean;
  compName: string;
  thereMoreProds: boolean;
  // user: User;
  isInProd: boolean;
  successAlert: boolean;
  successMessage: string;
  errorAlert: boolean;
  errorMessage: string;
  detailProd: ProductGet;

  // page: number = 0;
  // pageArr: Array<number> = [];

  pageNum: number = 0;

  @ViewChild('prodDetailComp') prodDetailComp: ProdDetailComponent;
  @ViewChild('closeProdFastViewModal') closeProdFastViewModal: ElementRef;

  constructor(
    private prodService: ProductService,
    private cartService: CartService,
    private router: Router,
    private userService: UserService
  ) {
    if (localStorage.getItem('cartLocal')) {
      this.cartService.cartInfo = JSON.parse(localStorage.getItem('cartLocal'));
    }
    if (localStorage.getItem('user')) {
      this.userService.userInfo = JSON.parse(localStorage.getItem('user'));
    }

    if (this.router.url == '/products') {
      // console.log(this.router.url);
      this.isInProd = true;
    }

    this.pageNum = 1;
    // this.actualPage = 1;
    // this.numberOfPages = 1;
    this.searching = false;
    this.noProds = false;
    this.thereMoreProds = false;
    this.compName = 'Productos';
    this.listProducts();
  }

  ngOnInit() {
  }

  counter(i: number) {
    return new Array(i);
  }

  listProducts() {
    this.filterString = 'Productos';
    this.searching = false;

    switch (this.prodService.filterType) {
      case 0:
        this.prodService.getAll().subscribe((data) => {
          this.productos = data;
          this.startPag();
        });
        break;
      case 1:
        this.prodService.getByCategoriaId(Number(this.prodService.filter)).subscribe((data) => {
          this.productos = data;
          if (data && data.length > 0) {
            this.filterString = "Productos > " + data[0].category.name;
          }
          this.startPag();
        });
        break;
      case 2:
        this.prodService.getBySubCategoriaId(Number(this.prodService.filter)).subscribe((data) => {
          this.productos = data;
          if (data && data.length > 0) {
            this.filterString = "Productos > " + data[0].category.name + " > " + data[0].subcategory.name;
          }
          this.startPag();
        });
        break;
      case 3:
        if (this.prodService.filter.length < 3) {
          this.noProds = true;
        } else {
          this.prodService.getBySearch(this.prodService.filter).subscribe((data) => {
            this.filterString = 'Palabra buscada: ' + this.prodService.filter;
            this.searching = true;
            this.productos = data;
            this.startPag();
          });
        }
        break;
      case 4:
        this.prodService.getSortedByBuyed().subscribe((data) => {
          this.productos = data;
          this.startPag();
        });
        break;
      case 5:
        this.prodService.getBySupplierId(Number(this.prodService.filter)).subscribe((data) => {
          this.productos = data;
          this.startPag();
        });
        break;

      default:
        break;
    }
  }

  startPag() {
    // this.numberOfPages = Math.floor(this.productos.length / this.prodPerPage);
    // if (this.productos.length % this.prodPerPage != 0) {
    //   this.numberOfPages += 1;
    // }
    // this.actualPage = 1;

    this.productos.forEach(element => {
      element.cant = 1;
    });

    if (this.productos.length == 0) {
      this.noProds = true;
    }

    if ((this.pageNum * this.prodPerPage) < this.productos.length) {
      this.thereMoreProds = true;
    } else {
      this.thereMoreProds = false;
    }

    // console.log(this.page);
    // console.log(this.pageArr);
    // console.log(this.productos);



    // this.paginate();
  }

  // Para paginacion
  // paginate() {
  //   this.noProds = false;

  //   this.prodOnPage = this.productos.slice(this.prodPerPage * (this.actualPage - 1), this.prodPerPage * this.actualPage);

  //   if (this.prodOnPage.length == 0) {
  //     this.noProds = true;
  //   }

  //   if ((this.page * 10) < this.productos.length) {
  //     this.thereMoreProds = true;
  //   }
  // }

  //Para paginacion
  // nextPage() {
  //   this.actualPage += 1;
  //   this.paginate();
  // }

  // prevPage() {
  //   this.actualPage -= 1;
  //   this.paginate();
  // }

  // selectPage(page: number) {
  //   this.actualPage = page;
  //   this.paginate();
  // }

  showMoreProducts() {
    this.pageNum++;

    if ((this.pageNum * this.prodPerPage) < this.productos.length) {
      this.thereMoreProds = true;
    } else {
      this.thereMoreProds = false;
    }
  }

  restCant(id: number) {
    this.productos.find(x => x.id === id).cant -= 1;
  }

  addCant(id: number) {
    this.productos.find(x => x.id === id).cant += 1;
  }

  sendToCart(prod: any) {
    if (this.userService.userInfo) {
      var cartInfo = new CartPost;

      cartInfo.isBuyed = false;
      cartInfo.productId = prod.id;
      cartInfo.quantity = prod.cant;
      if(prod.isOffer){
        cartInfo.totalPrice = (prod.cant * prod.priceOffer);
      } else {
        cartInfo.totalPrice = (prod.cant * prod.price);        
      }
      cartInfo.userId = this.userService.userInfo.id;

      this.cartService.save(cartInfo).subscribe((res) => {
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
    }
    else {
      if (this.cartService.cartInfo.find(x => x.productId === prod.id)) {
        this.cartService.cartInfo.find(x => x.productId === prod.id).quantity += prod.cant;
        this.cartService.cartInfo.find(x => x.productId === prod.id).totalPrice += (prod.cant * prod.price);
      } else {
        var cartL = new CartGet;
        cartL.quantity = prod.cant;
        if(prod.isOffer){
          cartL.totalPrice = (prod.cant * prod.priceOffer);
        } else {
          cartL.totalPrice = (prod.cant * prod.price);        
        }
        cartL.isBuyed = false;
        cartL.productId = prod.id;
        cartL.product = prod;

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

  prodFastView(prod: ProductGet){
    this.detailProd = prod;
    this.prodDetailComp.prodId = prod.id;
    this.prodDetailComp.updateInfo(prod);
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
