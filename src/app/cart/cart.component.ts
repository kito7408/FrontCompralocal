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
import { OrderService } from '../services/order.service';
import { OrderGet, OrderPost } from '../classes/order';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';
import { SuccErrMesagesComponent } from '../succ-err-mesages/succ-err-mesages.component';
import { Direction } from '../classes/direction';
import { DirectionService } from '../services/direction.service';
import { PagereviewService } from '../services/pagereview.service';
import { PageReviewPost } from '../classes/pagereview';
const departamentosJSON = require('../../assets/js/departamentos.json');
const provinciasJSON = require('../../assets/js/provincias.json');
const distritosJSON = require('../../assets/js/distritos.json');

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
  short_year: string = '';
  help_proy: string;
  newUser = new User;
  logUser = new User;
  deliveryPrice: number = 0;
  totalOrderPrice: number;
  paymentMethod: string = '';
  deliveryMethod: string = 'Delivery CompraLocal';
  orderInfo = new OrderPost;
  finishBuy: boolean = false;
  repass: string = '';
  re_email: string = '';
  haveFoV: boolean = false;
  FoVPrice: number = 0;
  starArr = [1, 2, 3, 4, 5];
  numStarsPainted: number = 0;
  numStarsSelected: number = 0;
  starsSelected: boolean = false;
  departamentos: any = departamentosJSON;
  provincias: any = provinciasJSON;
  distritos: any = distritosJSON;
  provByDep: any[];
  disByProv: any[];
  dirSelec = new Direction;
  dirUser: any[] = [];
  dirOnSelec: boolean = false;
  depOrd: string = '';
  provOrd: string = '';
  dirSelectedId: string = '';
  showReview: boolean = false;
  dataReview = new PageReviewPost;
  // cantOriginal: number[];
  // @Output() cartEvent = new EventEmitter;

  @ViewChild('closeModaPayment') closeModaPayment: ElementRef;
  @ViewChild('closeModaAyuda') closeModaAyuda: ElementRef;
  @ViewChild('userForm') userForm: NgForm;
  @ViewChild('alertComp') alertComp: SuccErrMesagesComponent;
  @ViewChild('modalCulqi') modalCulqi: ElementRef;
  @ViewChild('modalSelectProy') modalSelectProy: ElementRef;

  @Output() logEvent = new EventEmitter;

  constructor(
    public cartService: CartService,
    private routes: Router,
    public userService: UserService,
    private productService: ProductService,
    private orderService: OrderService,
    private dirService: DirectionService,
    private pageReviewS: PagereviewService
  ) {
    this.charging = false;
    this.paying = false;
    this.help_proy = "";
    this.setUserValues();
  }

  setUserValues() {
    if (localStorage.getItem('user')) {
      this.userService.userInfo = JSON.parse(localStorage.getItem('user'));
      this.newUser = this.userService.userInfo;
      this.getDirByUser();
    }
    this.listCarrito();
  }

  ngOnInit() {
  }

  getDirByUser() {
    this.dirService.getByUserId(this.userService.userInfo.id).subscribe(dirData => {
      this.dirUser = dirData;
      this.dirUser.forEach((element, index) => {
        element.nombre = 'Dirección ' + (index + 1);
      });
    });
  }

  getTotals() {
    this.cartService.cartQuantity = 0;
    this.cartService.cartTotalPrice = 0;
    this.FoVPrice = 0;
    if (this.cartService.cartInfo.length > 0) {
      this.cartService.cartInfo.forEach(element => {
        this.cartService.cartQuantity += element.quantity;
        this.cartService.cartTotalPrice += element.totalPrice;
        if (element.product.categoryId == 1) {
          this.haveFoV = true;
          this.FoVPrice += element.totalPrice;
        }
      });
      this.totalOrderPrice = this.cartService.cartTotalPrice + this.deliveryPrice;
    } else {
      this.routes.navigate(['/home']);
    }
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
  }

  masCantidad(productId: number) {
    this.cartService.cartInfo.find(x => x.productId === productId).quantity += 1;
    this.calcPrecioTotal(productId);
  }

  calcPrecioTotal(productId: number) {
    if (this.cartService.cartInfo.find(x => x.productId === productId).product.isOffer) {
      this.cartService.cartInfo.find(x => x.productId === productId).totalPrice = this.cartService.cartInfo.find(x => x.productId === productId).quantity * this.cartService.cartInfo.find(x => x.productId === productId).product.priceOffer;
    } else {
      this.cartService.cartInfo.find(x => x.productId === productId).totalPrice = this.cartService.cartInfo.find(x => x.productId === productId).quantity * this.cartService.cartInfo.find(x => x.productId === productId).product.price;
    }
    this.updateItem(this.cartService.cartInfo.find(x => x.productId === productId));
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
      itemToUpdate.isBuyed = item.isBuyed;

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

  enviarInfoTarjeta() {
    this.paying = true;
    this.tarjeta.expiration_year = "20" + this.short_year;
    this.tarjeta.card_number = this.tarjeta.card_number.replace(/\s+/g, "");

    this.cartService.sendToCulqi(this.tarjeta).subscribe((dataToken) => {
      // console.log("info culqi token",dataToken);
      var infoCargo = {
        amount: this.totalOrderPrice * 100,
        currency_code: 'PEN',
        email: dataToken.email,
        source_id: dataToken.id
      }
      this.cartService.crearCargo(infoCargo).subscribe((dataCargo) => {
        // console.log("cargo creado correctamente", dataCargo);
        // alert("cargo creado correctamente")
        this.crearOrden();
      }, (error) => {
        console.log(error);
        this.closeModalTarjetaInfo();
        this.alertComp.errorEvent("Hubo un problema al realizar el pago.")
      });
    }, (err) => {
      console.log(err);
      this.closeModalTarjetaInfo();
      this.alertComp.errorEvent("Hubo un problema al realizar el pago.")
    });
  }

  crearOrden() {
    this.orderInfo.num = String(Math.floor(new Date().getTime() / 1000)) + String(this.userService.userInfo.id);
    this.orderInfo.deliveryMethod = this.deliveryMethod;
    this.orderInfo.paymentMethod = this.paymentMethod;
    this.orderInfo.productsPrice = this.cartService.cartTotalPrice;
    this.orderInfo.deliveryPrice = this.deliveryPrice;
    this.orderInfo.totalPrice = this.totalOrderPrice;
    this.orderInfo.userId = this.userService.userInfo.id;

    switch (this.help_proy) {
      case "reforestacion":
        this.orderInfo.helpProyectId = 1;
        break;
      case "educacion":
        this.orderInfo.helpProyectId = 2;
        break;

      default:
        break;
    }

    this.orderService.save(this.orderInfo).subscribe((dataOrden: any) => {
      this.cartBuyed(dataOrden.data.id);
    });
  }

  cartBuyed(orderId: number) {    //pone los items del carrito en un estado de comprado y se les asigna a una orden
    this.cartService.buyCart(this.userService.userInfo.id, orderId).subscribe((data) => {
      this.sendMail(orderId);
      this.alertComp.successEvent('El pedido se realizó correctamente.');
      this.updateProdSales(orderId);
    })
  }

  sendMail(order_id: number) {
    this.orderService.getById(order_id).subscribe((orderData: any) => {
      orderData.date = moment(orderData.createdAt).locale('es').format('LL');
      this.orderService.sendUserMail(orderData).subscribe((data) => {
        setTimeout(() => {
          this.orderService.sendAdminMail(orderData).subscribe((data2) => {
            if (orderData.paymentMethod != 'culqi') {
              setTimeout(() => {
                this.orderService.sendPagoPendienteMail(orderData);
              }, 1000);
            }
          });
        }, 1000);
      });
    })
  }

  closeModalTarjetaInfo() {
    this.paying = false;
    this.tarjeta = new Tarjeta;
    this.short_year = '';
    this.closeModaPayment.nativeElement.click();
    this.closeModaAyuda.nativeElement.click();
  }

  updateProdSales(orderId: number) {    //actualiza la cantidad de veces que se compraron los articulos
    var prodsInfo = [];
    this.cartService.cartInfo.forEach(item => {
      var itemInfo = {
        prodId: item.productId,
        cant: item.quantity
      };
      prodsInfo.push(itemInfo);
    });
    this.productService.updateSales(prodsInfo).subscribe((data) => {
      // console.log("dat", data);

      setTimeout(() => {
        this.cartService.cartInfo = [];
        this.cartService.cartQuantity = 0;
        this.cartService.cartTotalPrice = 0;
        this.closeModalTarjetaInfo();
        this.routes.navigate(['/orders/' + orderId]);
      }, 3000);
    });
  }

  card_number_eval() {
    if (this.tarjeta.card_number.length == 4 || this.tarjeta.card_number.length == 9 ||
      this.tarjeta.card_number.length == 14) {
      this.tarjeta.card_number += ' ';
    }
  }

  saveReview(){
    if (this.showReview && this.starsSelected) {
      this.dataReview.stars = this.numStarsSelected;
      this.dataReview.userId = this.userService.userInfo.id;
      this.pageReviewS.save(this.dataReview).subscribe((dataResult) => {
        console.log("review guardada");
      });
    }
  }

  actionsOnPay() {
    //set direction for the order
    if (this.dirOnSelec) {
      this.orderInfo.directionId = this.dirSelec.id;
      if (this.paymentMethod == 'culqi') {
        this.orderInfo.paymentState = 'Pagado';
        this.closeModaAyuda.nativeElement.click();
        this.tarjeta.email = this.userService.userInfo.email;
        this.modalCulqi.nativeElement.click();
      } else {
        this.orderInfo.paymentState = 'Pendiente de Pago';
        this.crearOrden();
      }
    } else {
      this.dirSelec.userId = this.userService.userInfo.id;
      this.dirService.save(this.dirSelec).subscribe((dataDir) => {
        this.orderInfo.directionId = dataDir.data.id;
        if (this.paymentMethod == 'culqi') {
          this.orderInfo.paymentState = 'Pagado';
          this.closeModaAyuda.nativeElement.click();
          this.tarjeta.email = this.userService.userInfo.email;
          this.modalCulqi.nativeElement.click();
        } else {
          this.orderInfo.paymentState = 'Pendiente de Pago';
          this.crearOrden();
        }
      });
    }
    this.saveReview();
  }

  cartLocalToDB() {
    localStorage.removeItem('cartLocal');
    if (this.cartService.cartInfo && this.cartService.cartInfo.length > 0) {
      var cartLocalToSave = new Array<CartPost>();
      this.cartService.cartInfo.forEach(item => {
        var cl = new CartPost;
        cl.isBuyed = item.isBuyed;
        cl.productId = item.productId;
        cl.quantity = item.quantity;
        cl.totalPrice = item.totalPrice;
        cl.userId = this.userService.userInfo.id;
        cartLocalToSave.push(cl);
      });

      this.cartService.saveMany(cartLocalToSave).subscribe((data) => {
        // console.log("save many", data);
        this.actionsOnPay();
      });
    }
  }

  regAndPay() {
    if (this.newUser.password == this.repass) {
      if (this.newUser.email == this.re_email) {
        // this.loading = true;
        this.newUser.userTypeId = 2;
        this.userService.save(this.newUser).subscribe((data: any) => {
          localStorage.setItem('user', JSON.stringify(data.data));
          this.userService.userInfo = data.data;
          this.cartLocalToDB();
        }, (error) => {
          // console.log(error);
          this.alertComp.errorEvent('Error al registrar nuevo usuario.');
        });
      } else {
        this.alertComp.errorEvent('El email repetido debe ser igual al original.');
        this.closeModaAyuda.nativeElement.click();
      }
    } else {
      this.alertComp.errorEvent('La contraseña repetida debe ser igual a la original.');
      this.closeModaAyuda.nativeElement.click();
    }
  }

  GoToPay() {
    this.finishBuy = true;
    if (this.userService.userInfo) {
      this.actionsOnPay();
    } else {
      this.regAndPay();
    }
  }

  finalizarCompra(form: NgForm) {
    this.finishBuy = false;
    this.showReview = false;
    this.help_proy = '';

    if (!(form.valid)) {
      this.alertComp.errorEvent('Por favor llene los campos obligatorios correctamente.');
      return;
    }
    if (this.deliveryMethod == '') {
      this.alertComp.errorEvent('Seleccione el método de envío.');
      return;
    }
    if (this.paymentMethod == '') {
      this.alertComp.errorEvent('Seleccione el método de pago.');
      return;
    }
    if (this.haveFoV && (this.FoVPrice < 50)) {
      this.alertComp.errorEvent('El monto mínimo para frutas y verduras es de 50 soles.');
      return;
    }
    this.modalSelectProy.nativeElement.click();
  }

  selectHelp(proy: string) {
    this.help_proy = proy;
    if (this.userService.userInfo) {
      this.pageReviewS.getByUserId(this.userService.userInfo.id).subscribe((reviewUser) => {
        if (reviewUser) {
          this.showReview = false;
        } else {
          this.showReview = true;
        }
      });
    } else {
      this.showReview = true;
    }
  }

  regUser(userForm: NgForm) {
    console.log(userForm);
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

  getProvinciasByDepartamento(dep_id: string) {
    this.provOrd = '';
    this.dirSelec.distrito = '';
    this.dirSelec.provincia = '';
    this.provByDep = this.provincias[dep_id];
    this.dirSelec.departamento = this.departamentos.find(x => x.id_ubigeo === dep_id).nombre_ubigeo;
    this.deliveryPrice = 0;
  }

  getDistritosByProvincias(prov_id: string) {
    this.dirSelec.distrito = '';
    this.disByProv = this.distritos[prov_id];
    this.dirSelec.provincia = this.provByDep.find(x => x.id_ubigeo === prov_id).nombre_ubigeo;
    this.setDeliveryPrice();
  }

  setDirectionsFromList() {
    if (this.dirSelectedId == '') {
      this.dirOnSelec = false;
      this.depOrd = '';
      this.provOrd = '';
      this.dirSelec = new Direction;
      this.deliveryPrice = 0;
    } else {
      this.dirOnSelec = true;
      this.dirService.getById(Number(this.dirSelectedId)).subscribe((data) => {
        this.setDirValues(data);
      });
    }
  }

  setDirValues(dir) {
    this.dirSelec = dir;
    this.depOrd = this.departamentos.find(x => x.nombre_ubigeo === dir.departamento).id_ubigeo;
    this.provByDep = this.provincias[this.depOrd];
    this.provOrd = this.provByDep.find(x => x.nombre_ubigeo === dir.provincia).id_ubigeo;
    this.disByProv = this.distritos[this.provOrd];
    this.setDeliveryPrice();
  }

  openLogin() {
    this.logEvent.emit('login');
  }

  setDeliveryPrice() {
    this.deliveryPrice = 0;
    if (this.dirSelec.provincia == 'Lima') {
      this.cartService.cartInfo.forEach(element => {
        this.deliveryPrice += (10 * element.quantity);
      });
    } else {
      this.cartService.cartInfo.forEach(element => {
        this.deliveryPrice += (15 * element.quantity);
      });
    }
  }
}
