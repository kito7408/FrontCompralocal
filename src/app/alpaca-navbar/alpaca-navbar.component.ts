import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Inject, HostListener } from '@angular/core';
import { User } from '../classes/user';
import { ProductPost } from '../classes/productPost';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { CategoryPost } from '../classes/categoryPost';
import { CategoryGet } from '../classes/categoryGet';
import { Supplier } from '../classes/supplier';
import { CartGet } from '../classes/cartGet';
import { Subcategory } from '../classes/subCategory';

import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';
import { CategoriaService } from '../services/categoria.service';
import { SupplierService } from '../services/supplier.service';
import { CartService } from '../services/cart.service';
import { SubcategoryService } from '../services/subcategory.service';

import { AuthService, SocialUser } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { CartPost } from '../classes/cartPost';
import { NgForm } from '@angular/forms';
import { SuccErrMesagesComponent } from '../succ-err-mesages/succ-err-mesages.component';
import { hostViewClassName } from '@angular/compiler';
import { Subscription } from '../classes/subscription';
import { SubscriptionService } from '../services/subscription.service';
import { ProdModelService } from '../services/prod-model.service';
import { ProdMod } from '../classes/prodModel';
import { DeliveryZoneService } from '../services/delivery-zone.service';
import { DeliveryZone, DeliveryZoneLocal } from '../classes/deliveryZone';
const departamentosJSON = require('../../assets/js/departamentos.json');
const provinciasJSON = require('../../assets/js/provincias.json');
const distritosJSON = require('../../assets/js/distritos.json');

@Component({
  selector: 'app-alpaca-navbar',
  templateUrl: './alpaca-navbar.component.html',
  styleUrls: ['./alpaca-navbar.component.css']
})
export class AlpacaNavbarComponent implements OnInit {

  // user: User;           //for localstorage
  newUser = new User;   //for forms
  newProduct = new ProductPost;
  newCategoria = new CategoryPost;
  // newSubcategoria = new Subcategory;
  newSupplier = new Supplier;
  imagen: File;
  usersTest: User[];
  repass: string;
  re_email: string;
  prodImg: File;
  filemsg: string;
  suppImg: File;
  suppfilemsg: string;
  suppImg2: File;
  suppfilemsg2: string;
  searchText: string;
  categorias: CategoryGet[];
  subcategorias: Subcategory[];
  suppliers: Supplier[];
  loading: boolean;
  // cart: CartGet[];
  // cartPrice: number;
  // cartQuantity: number;
  prodImgCant: number = 0;
  prodImgArr: number[] = [];
  prodImgFileArr = new Array<File>();

  prodModelCant: number = 0;
  prodModelArr: number[] = [];
  prodModelData = new Array<ProdMod>();
  filemsg2: string = '';

  departamentos: any = departamentosJSON;
  provincias: any = provinciasJSON;
  distritos: any = distritosJSON;
  provByDep: any[];
  disByProv: any[];
  depSupp: string = '';
  provSupp: string = '';

  subInfo = new Subscription;
  accessCheck: boolean = false;
  depSub: string = '';
  provSub: string = '';
  rucOp: string = 'si';
  cateOtros: string = '';
  @ViewChild('closeModalInfo') closeModalInfo: ElementRef;

  delZoneArr = new Array<DeliveryZoneLocal>();
  delZoneCant: number = 0;
  distritosLima = distritosJSON[3927];
  provDeliveryPrice = 0;
  daysToSend = [
    {
      send: false,
      name: 'Lunes'
    },
    {
      send: false,
      name: 'Martes'
    },
    {
      send: false,
      name: 'Miércoles'
    },
    {
      send: false,
      name: 'Jueves'
    },
    {
      send: false,
      name: 'Viernes'
    },
    {
      send: false,
      name: 'Sabado'
    },
    {
      send: false,
      name: 'Domingo'
    },
  ];
  allDays: boolean = false;

  suppSelected: boolean = false;

  usernameResetPass: string = '';

  private socialUser: SocialUser;
  private loggedIn: boolean;

  @ViewChild('closeLoginModal') closeLoginModal: ElementRef;
  // @ViewChild('closeRegModal') closeRegModal: ElementRef;
  @ViewChild('closeAddUserModal') closeAddUserModal: ElementRef;
  @ViewChild('closeAddProductModal') closeAddProductModal: ElementRef;
  @ViewChild('closeAddSupplierModal') closeAddSupplierModal: ElementRef;
  @ViewChild('closeStartModal') closeStartModal: ElementRef;
  // @ViewChild('closeAddCategoriaModal') closeAddCategoriaModal: ElementRef;
  // @ViewChild('closeAddSubCategoriaModal') closeAddSubCategoriaModal: ElementRef;
  @ViewChild('modalStart') modalStart: ElementRef;
  @ViewChild('loginButton') loginButton: ElementRef;
  @ViewChild('logoutButton') logoutButton: ElementRef;
  @ViewChild('registerButton') registerButton: ElementRef;
  @ViewChild('listMyOrdsButton') listMyOrdsButton: ElementRef;
  @ViewChild('listOrdsButton') listOrdsButton: ElementRef;
  @ViewChild('addUserButton') addUserButton: ElementRef;
  @ViewChild('addSuppButton') addSuppButton: ElementRef;
  @ViewChild('addProdButton') addProdButton: ElementRef;
  @ViewChild('formLoginSubmit') formLoginSubmit: ElementRef;
  @ViewChild('closeModalResetPass') closeModalResetPass: ElementRef;
  @ViewChild('alertComp') alertComp: SuccErrMesagesComponent;

  @Output() addEvent = new EventEmitter;

  constructor(
    public userService: UserService,
    private prodService: ProductService,
    private route: ActivatedRoute,
    private routes: Router,
    private suppService: SupplierService,
    private catService: CategoriaService,
    private authService: AuthService,
    public cartService: CartService,
    private subsService: SubscriptionService,
    private prodModService: ProdModelService,
    private delZoneService: DeliveryZoneService,
    private location: Location,
    private sbcService: SubcategoryService
  ) {
    this.loading = false;
    this.filemsg = '';
    this.suppfilemsg = '';
    this.searchText = '';
    this.re_email = '';
    this.repass = '';
    this.newUser.userTypeId = 2;
    this.newProduct.isOffer = false;
    this.newProduct.toProv = false;
    this.newProduct.priceOffer = 0;
    this.getCategorias();
    // this.getSubCategorias();
    this.getSuppliers();
    this.addProdImg();
    // this.addProdModel();
    this.addDelZone();
    // var modAux = new ProdMod;
    // this.prodModelData.push(modAux);
    // this.prodModelCant = 1;
    // this.prodModelArr.push(0);

    if (localStorage.getItem('user')) {
      this.userService.userInfo = JSON.parse(localStorage.getItem('user'));
      this.updateCart();
    } else {
      if (localStorage.getItem('cartLocal')) {
        this.cartService.cartInfo = JSON.parse(localStorage.getItem('cartLocal'));
        this.cartService.cartQuantity = 0;
        this.cartService.cartTotalPrice = 0;
        this.cartService.cartInfo.forEach(item => {
          this.cartService.cartTotalPrice += item.totalPrice;
          this.cartService.cartQuantity += item.quantity;
        });
      }
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // console.log(document.documentElement.scrollHeight);
    // console.log(document.documentElement.scrollTop);

    if (document.body.scrollTop > 50 ||
      document.documentElement.scrollTop > 50) {
      document.getElementById('nav-options').classList.add('fixed-top');
    } else {
      document.getElementById('nav-options').classList.remove('fixed-top');
    }

    // if ((document.documentElement.scrollHeight - document.documentElement.scrollTop) < 970) {
    //   document.getElementById('goUpButton').classList.add('d-none');
    // } else {
    //   document.getElementById('goUpButton').classList.remove('d-none');
    // }
  }

  ngOnInit() {
    this.authService.authState.subscribe((result) => {
      // console.log("socialuser", result);
      this.socialUser = result;
      this.loggedIn = (result != null);
    });

    // if (!this.location.path().includes('/home/')) {
    //   setTimeout(() => {
    //     this.modalStart.nativeElement.click();
    //   }, 3000);
    // }
  }

  addProdImg() {
    this.prodImgFileArr.push(null);
    this.prodImgArr.push(this.prodImgCant);
    this.prodImgCant++;
  }

  rmvProdImg() {
    this.prodImgFileArr.pop();
    this.prodImgArr.pop();
    this.prodImgCant--;
  }

  addProdModel() {
    var newMod = new ProdMod;
    this.prodModelData.push(newMod);
    this.prodModelArr.push(this.prodModelCant);
    this.prodModelCant++;
  }

  rmvProdModel() {
    this.prodModelData.pop();
    this.prodModelArr.pop();
    this.prodModelCant--;
  }

  addDelZone() {
    var newZone = new DeliveryZoneLocal;
    newZone.num = this.delZoneCant;
    newZone.price = 0;
    newZone.districts = [];
    this.delZoneArr.push(newZone);
    this.delZoneCant++;
  }

  rmvDelZone() {
    this.delZoneArr.pop();
    this.delZoneCant--;
  }

  updateCart() {
    this.cartService.getByUserId(this.userService.userInfo.id).subscribe((dataCart: CartGet[]) => {
      this.cartService.cartInfo = dataCart;
      this.cartService.cartQuantity = 0;
      this.cartService.cartTotalPrice = 0;
      this.cartService.cartInfo.forEach(item => {
        this.cartService.cartTotalPrice += item.totalPrice;
        this.cartService.cartQuantity += item.quantity;
      });
      this.addEvent.emit('user');
      this.closeModal();
    });
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
        this.updateCart();
      });
    } else {
      this.updateCart();
    }
  }

  login() {
    // this.loading = true;
    
    this.userService.login(this.newUser.email, this.newUser.password)
      .subscribe((data: any) => {
        this.actionsOnLogin(data.data);
      }, (error) => {
        // console.log(error);
        this.alertComp.errorEvent('El usuario es invalido');
      });
  }

  actionsOnLogin(dataUser) {
    localStorage.setItem('user', JSON.stringify(dataUser.user));
    localStorage.setItem('token', dataUser.token);

    // localStorage.setItem('cartLocal', JSON.stringify(this.cartService.cartInfo));
    this.userService.userInfo = dataUser.user;
    this.alertComp.successEvent('Bienvenido ' + dataUser.user.name);
    this.cartLocalToDB();
  }

  newPass(form: NgForm) {
    if (form.valid) {
      this.userService.newPassStep1(this.usernameResetPass).subscribe((result) => {
        this.alertComp.successEvent("Se ha enviado el correo exitosamente.");
        this.closeModalResetPass.nativeElement.click();
      }, (error) => {
        this.alertComp.errorEvent("No se ha encontrado un usuario con el email indicado.");
        this.closeModalResetPass.nativeElement.click();
      });
    }
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.cartService.cartInfo = new Array<CartGet>();
    this.cartService.cartQuantity = 0;
    this.cartService.cartTotalPrice = 0;
    this.userService.userInfo = null;
    this.closeModal();
    if (this.loggedIn) {
      this.signOut();
    }
    this.routes.navigate(['/']);
  }

  register(form: NgForm) {
    if (form.valid) {
      if (this.newUser.password == this.repass) {
        if (this.newUser.email == this.re_email) {
          // this.loading = true;
          this.userService.save(this.newUser).subscribe((data: any) => {
            if (!this.userService.userInfo) {
              this.login();
            } else {
              this.alertComp.successEvent('Nuevo usuario registrado.');
            }
            // this.closeModal();
          }, (error) => {
            // console.log(error);
            this.alertComp.errorEvent('Error al registrar nuevo usuario.');
          });
        } else {
          this.alertComp.errorEvent('El email repetido debe ser igual al original.');
        }
      } else {
        this.alertComp.errorEvent('La contraseña repetida debe ser igual a la original.');
      }
    }
  }

  closeModal() {
    // this.loading = false;
    this.closeLoginModal.nativeElement.click();
    // this.closeRegModal.nativeElement.click();
    this.closeAddUserModal.nativeElement.click();
    this.closeAddProductModal.nativeElement.click();
    this.closeAddSupplierModal.nativeElement.click();
    // this.closeAddCategoriaModal.nativeElement.click();
    // this.closeAddSubCategoriaModal.nativeElement.click();
    this.newUser = new User;
    this.repass = '';
    this.re_email = '';
    this.newUser.userTypeId = 2;
    this.newProduct = new ProductPost;
    this.newSupplier = new Supplier;
    this.newCategoria = new CategoryPost;
    // this.newSubcategoria = new Subcategory;
    this.searchText = '';
  }

  evaluateProdImgFileArr() {
    this.filemsg = '';
    this.prodImgFileArr.forEach(element => {
      if (element) {
        if (element.type.match(/image\/*/) == null) {
          this.filemsg = "Solo se aceptan imagenes";
        }
      }
    });
  }

  selectFile(event, imgIndx: number) {
    this.prodImgFileArr[imgIndx] = <File>event.target.files[0];
    this.evaluateProdImgFileArr();
  }

  evaluateProdModelArrImg() {
    this.filemsg2 = '';
    this.prodModelData.forEach(element => {
      if (element) {
        if (element.image.type.match(/image\/*/) == null) {
          this.filemsg2 = "Solo se aceptan imagenes";
        }
      }
    });
  }

  selectFile2(event, imgIndx: number) {
    this.prodModelData[imgIndx].image = <File>event.target.files[0];
    this.evaluateProdModelArrImg();
  }

  selectFileSupp(event) {
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      this.suppfilemsg = 'Debes seleccionar una imagen';
      return;
    }

    var mimeType = event.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.suppfilemsg = "Solo se aceptan imagenes";
      return;
    }

    this.suppImg = <File>event.target.files[0];
    // console.log(this.suppImg);

    this.suppfilemsg = '';
  }

  selectFileSupp2(event) {
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      this.suppfilemsg2 = 'Debes seleccionar una imagen';
      return;
    }

    var mimeType = event.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.suppfilemsg2 = "Solo se aceptan imagenes";
      return;
    }

    this.suppImg2 = <File>event.target.files[0];

    this.suppfilemsg2 = '';
  }

  card_number_eval() {
    if (this.newSupplier.account_number.length == 4 || this.newSupplier.account_number.length == 9 ||
      this.newSupplier.account_number.length == 14) {
      this.newSupplier.account_number += ' ';
    }
  }

  telephone_eval() {
    if (this.newSupplier.phone_contact.length == 3 || this.newSupplier.phone_contact.length == 7) {
      this.newSupplier.phone_contact += '-';
    }
  }

  saveProdModels(prodInfo: any) {

    if (this.prodModelData.length > 0) {
      var contDataSaved = 0;
      this.prodModelData.forEach(element => {
        element.productId = prodInfo.id;

        this.prodModService.save(element).subscribe(result => {
          contDataSaved++;

          if (contDataSaved == this.prodModelData.length) {
            this.saveDeliveryZones(prodInfo);
          }

        }, err => {
          console.log("error prodmod", err);
          this.loading = false;
          this.alertComp.errorEvent("error al guardar los modelos");
          return;
        });

      });
    } else {
      this.saveDeliveryZones(prodInfo);
    }

    // this.prodModelItems.forEach(element => {
    //   var dataItem = new ProdMod;
    //   dataItem.name = element;
    //   dataItem.productId = id_prod;
    //   this.prodModelData.push(dataItem);
    // });

    // this.prodModService.saveMany(this.prodModelData).subscribe(result => {
    //   console.log("info guardada");

    // }, err => {
    //   console.log("error prodmod", err);
    //   this.alertComp.errorEvent("error al guardar los modelos")
    // });
  }

  saveDeliveryZones(prod: any) {

    var arrData = new Array<DeliveryZone>();

    this.delZoneArr.forEach(element => {
      var dataZone = new DeliveryZone;
      dataZone.price = element.price;
      dataZone.districts = element.districts;
      dataZone.productId = prod.id;

      arrData.push(dataZone);
    });

    if (prod.toProv) {
      var deliveryToProv = new DeliveryZone;
      deliveryToProv.price = this.provDeliveryPrice;
      deliveryToProv.districts = ['provincias'];
      deliveryToProv.productId = prod.id;

      arrData.push(deliveryToProv);
    }

    this.delZoneService.saveMany(arrData).subscribe(result => {
      setTimeout(() => {
        this.loading = false;
        this.closeModal();
        this.listAll();
        this.alertComp.successEvent('Producto agregado correctamente');
      }, 3000);
    }, err => {
      this.loading = false;
      console.log("error prodmod", err);
      this.alertComp.errorEvent("error al guardar los modelos");
    });
  }

  addProd(form: NgForm) {
    if (form.valid) {
      if (this.filemsg == '' && this.filemsg2 == '') {
        this.loading = true;
        this.newProduct.image1 = this.prodImgFileArr[0];
        this.newProduct.image2 = this.prodImgFileArr[1];
        this.newProduct.image3 = this.prodImgFileArr[2];
        this.newProduct.image4 = this.prodImgFileArr[3];
        this.newProduct.image5 = this.prodImgFileArr[4];

        var daysString = '';
        this.daysToSend.forEach((element, index) => {
          if (element.send) {
            if (daysString != '') {
              daysString += ',';
            }
            daysString += element.name;
          }
        });

        this.newProduct.daysToSend = daysString;

        this.newProduct.numSellOnWeek = 0;
        this.newProduct.isTrent = false;
        // this.newProduct.subcategoryId = 1;
        this.prodService.save(this.newProduct).subscribe((data: any) => {
          this.saveProdModels(data.data);
        }, (error) => {
          console.log(error);
          this.loading = false;
          this.alertComp.errorEvent('Error al agregar producto');
        })
      } else {
        this.alertComp.errorEvent('Debes seleccionar imagenes adecuada para el producto');
      }
    }
  }

  addSupplier(form: NgForm) {
    if (form.valid) {
      if (this.suppfilemsg == '' && this.suppImg) {
        this.loading = true;
        this.newSupplier.image = this.suppImg;
        this.newSupplier.image_person = this.suppImg2;
        this.newSupplier.available = true;
        // this.newSupplier.account_number = this.newSupplier.account_number.replace(/\s+/g, "");
        // this.newSupplier.phone_contact = this.newSupplier.phone_contact.replace(/-+/g, "");

        this.suppService.save(this.newSupplier).subscribe((data: any) => {
          this.getSuppliers();
          this.closeModal();
          this.addEvent.emit('suppliers');
          this.loading = false;
          this.alertComp.successEvent('Proveedor creado correctamente')
        }, (error) => {
          console.log(error);
          this.loading = false;
          this.alertComp.errorEvent('Error al crear proveedor')
        });
      } else {
        this.alertComp.errorEvent('Debes seleccionar una imagen para el logo del proveedor')
      }
    }
  }

  addCategoria() {
    this.loading = true;
    this.catService.save(this.newCategoria).subscribe((data: any) => {
      this.getCategorias();
      this.closeModal();
      this.alertComp.successEvent('Categoría agregada correctamente')
    }, (error) => {
      console.log(error);
      this.alertComp.errorEvent('Error al agregar categoría');
    });
  }

  // addSubcategoria() {
  //   this.loading = true;
  //   this.sbcService.save(this.newSubcategoria).subscribe((data: any) => {
  //     this.getCategorias();
  //     this.closeModal();
  //     this.alertComp.successEvent('Subcategoria agregada correctamente')
  //   }, (error) => {
  //     this.alertComp.errorEvent('Error al agregar subcategoria')
  //   })
  // }

  getCategorias() {
    this.catService.getAll().subscribe((data: CategoryGet[]) => {
      
      // data.splice(3, 1);
      // data.splice(1, 1);

      this.categorias = data;
    });
  }

  // getSubCategorias() {
  //   this.sbcService.getAll().subscribe((data: Subcategory[]) => {
  //     console.log(data);
      

  //     this.subcategorias = data;
  //   });
  // }

  getSubcategoriasByCategoria(id: number) {
    this.sbcService.getByCategoryId(id).subscribe((data: Subcategory[]) => {
      this.subcategorias = data;
    })
  }

  getSuppliers() {
    this.suppService.getAll().subscribe((data: Supplier[]) => {
      this.suppliers = data;
    });
  }

  signInWithGoogle(): void {
    // this.loading = true;
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((data: SocialUser) => {
      this.userService.loginSocialMedia(data.email).subscribe((userData) => {
        this.actionsOnLogin(userData.data);
      });
    });
  }

  signInWithFB(): void {
    // this.loading = true;
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then((data: SocialUser) => {
      this.userService.loginSocialMedia(data.email).subscribe((userData) => {
        this.actionsOnLogin(userData.data);
      });
    });
  }

  signOut(): void {
    this.authService.signOut();
  }

  goToProducto(id: number) {
    this.routes.navigate(['/products/' + id]);
  }

  goToCart() {
    this.routes.navigate(['/cart']);
  }

  goToHome() {
    this.searchText = '';
    this.prodService.filterType = 0;
    this.prodService.filter = '';
    // this.addEvent.emit('products');
    this.routes.navigate(['/home']);
  }

  goToOrders() {
    this.routes.navigate(['/orders']);
  }

  newUserF() {
    this.newUser = new User;
    this.newUser.userTypeId = 2;
  }

  newSuppF() {
    this.newSupplier = new Supplier;
  }

  newProdF() {
    this.prodImgCant = 0;
    this.prodImgArr = [];
    this.prodImgFileArr = new Array<File>();
    this.filemsg = '';
    this.addProdImg();

    this.prodModelCant = 0;
    this.prodModelArr = [];
    this.prodModelData = new Array<ProdMod>();
    this.filemsg2 = '';
    // this.addProdModel();

    this.delZoneCant = 0;
    this.delZoneArr = new Array<DeliveryZoneLocal>();
    this.addDelZone();

    this.newProduct = new ProductPost;
  }

  goUp() {
    // document.documentElement.scrollTop = 0;
    document.getElementById('first').scrollIntoView({ behavior: 'smooth' });
  }

  getProvinciasByDepartamento(dep_id: string) {
    this.provSupp = '';
    this.newSupplier.distrito = '';
    this.newSupplier.provincia = '';
    this.provByDep = this.provincias[dep_id];
    this.newSupplier.departamento = this.departamentos.find(x => x.id_ubigeo === dep_id).nombre_ubigeo;
  }

  getDistritosByProvincias(prov_id: string) {
    this.newSupplier.distrito = '';
    this.disByProv = this.distritos[prov_id];
    this.newSupplier.provincia = this.provByDep.find(x => x.id_ubigeo === prov_id).nombre_ubigeo;
  }

  selectClientType(type: number) {
    this.subInfo = new Subscription;
    this.accessCheck = false;
    this.rucOp = 'si';
    this.depSub = '';
    this.provSub = '';
    switch (type) {
      case 1:
        this.subInfo.clientType = 'emprendedor';
        break;

      case 2:
        this.subInfo.clientType = 'persona';
        break;

      default:
        break;
    }
  }

  saveData(form: NgForm) {
    if (form.valid) {
      if (this.subInfo.categoria == 'Otros') {
        this.subInfo.categoria = this.cateOtros;
      }
      // this.subInfo.phone = this.subInfo.phone.replace(/-+/g, "");
      this.subsService.save(this.subInfo).subscribe((data) => {
        this.closeModalInfo.nativeElement.click();
        this.closeStartModal.nativeElement.click();
        this.alertComp.successEvent('Se han guardado tus datos, muchas gracias.')
      }, (err) => {
        this.alertComp.errorEvent('Ha ocurrido un error al guardar tus datos.')
      });
    }
  }

  getProvinciasByDepartamentoSub(dep_id: string) {
    this.provSub = '';
    this.subInfo.distrito = '';
    this.subInfo.provincia = '';
    this.provByDep = this.provincias[dep_id];
    this.subInfo.departamento = this.departamentos.find(x => x.id_ubigeo === dep_id).nombre_ubigeo;
  }

  getDistritosByProvinciasSub(prov_id: string) {
    this.subInfo.distrito = '';
    this.disByProv = this.distritos[prov_id];
    this.subInfo.provincia = this.provByDep.find(x => x.id_ubigeo === prov_id).nombre_ubigeo;
  }

  selectDistrict(num: number) {
    if (!this.delZoneArr[num].districts.includes(this.delZoneArr[num].districtSelected)) {
      this.delZoneArr[num].districts.push(this.delZoneArr[num].districtSelected);
    }
  }

  deleteDisSelected(num: number, index: number) {
    this.delZoneArr[num].districts.splice(index, 1);
  }

  sendAllDays() {
    if (this.allDays) {
      this.daysToSend.forEach(element => {
        element.send = true;
      });
    } else {
      this.daysToSend.forEach(element => {
        element.send = false;
      });
    }
  }

  //Event Emitters
  listProdCat(categoriaId: number) {
    this.prodService.filterType = 1;
    this.prodService.filter = String(categoriaId);
    if (this.routes.url == '/products') {
      this.addEvent.emit('products');
    } else {
      this.routes.navigate(['/products']);
    }
  }

  listProdSubCat(subcategoriaId: number) {
    this.prodService.filterType = 2;
    this.prodService.filter = String(subcategoriaId);
    this.routes.navigate(['/products'])
    this.addEvent.emit('products');
  }

  listProdSearch() {
    this.prodService.filterType = 3;
    this.prodService.filter = this.searchText;
    if (this.routes.url == '/products') {
      this.addEvent.emit('products');
    } else {
      this.routes.navigate(['/products']);
    }
  }

  listAll() {
    this.prodService.filterType = 0;
    this.prodService.filter = '';
    if (this.routes.url == '/products') {
      this.addEvent.emit('products');
    } else {
      this.routes.navigate(['/products']);
    }
  }

}
