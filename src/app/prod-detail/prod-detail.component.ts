import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
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
import { CategoryGet } from '../classes/categoryGet';
import { CategoriaService } from '../services/categoria.service';
import { Supplier } from '../classes/supplier';
import { SupplierService } from '../services/supplier.service';
import { DeliveryZone, DeliveryZoneLocal } from '../classes/deliveryZone';
import { NgForm } from '@angular/forms';
import { ProdModelService } from '../services/prod-model.service';
import { DeliveryZoneService } from '../services/delivery-zone.service';
const departamentosJSON = require('../../assets/js/departamentos.json');
const provinciasJSON = require('../../assets/js/provincias.json');
const distritosJSON = require('../../assets/js/distritos.json');

@Component({
  selector: 'app-prod-detail',
  templateUrl: './prod-detail.component.html',
  styleUrls: ['./prod-detail.component.css']
})
export class ProdDetailComponent implements OnInit {

  producto: ProductGet;
  newProduct = new ProductPost;
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
  pathMod: string = 'https://compralocal-images.s3.us-east-2.amazonaws.com/product-models/';
  deleting: boolean = false;
  onUpdate: boolean = false;
  fecha_entrega: string = '';
  fecha_entrega2: string = '';
  dist_entrega: string = '';
  deliveryPrice: number = 0;
  prodModSelect: number;
  categorias: CategoryGet[];
  suppliers: Supplier[];
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

  prodImgCant: number = 0;
  prodImgArr: number[] = [];
  prodImgFileArr = new Array<File>();
  filemsg: string = '';
  imgEdit: string[] = [];

  prodModelCant: number = 0;
  prodModelArr: number[] = [];
  prodModelData = new Array<ProdMod>();
  filemsg2: string = '';
  imgModEdit: string[] = [];

  delZoneArr = new Array<DeliveryZoneLocal>();
  delZoneCant: number = 0;
  distritosLima = distritosJSON[3927];
  provDeliveryPrice: number = 0;

  loading: boolean = false;

  newImgs: boolean[] = [false, false, false, false, false];

  onCalcEnv: boolean = false;
  calcDep: string = '';
  calcProv: string = '';
  calcDis: string = '';
  departamentos: any = departamentosJSON;
  provincias: any = provinciasJSON;
  distritos: any = distritosJSON;
  provByDep: any[];
  disByProv: any[];
  calculando: boolean = false;

  @ViewChild('alertComp') alertComp: SuccErrMesagesComponent;
  @ViewChild('closeModalDeleteProd') closeModalDeleteProd: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private routes: Router,
    private prodService: ProductService,
    public cartService: CartService,
    public userService: UserService,
    private prodCommentService: ProdCommentService,
    private _location: Location,
    private catService: CategoriaService,
    private suppService: SupplierService,
    private prodModService: ProdModelService,
    private delZoneService: DeliveryZoneService
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

      this.getProd(this.prodId);
    });

    if (this.routes.url == '/home') {
      // console.log(this.router.url);
      this.isInHome = true;
    }
  }

  ngOnInit() {
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

  resetProdImg() {
    this.prodImgCant = 0;
    this.prodImgArr = [];
    this.prodImgFileArr = new Array<File>();
    this.filemsg = '';
    this.imgEdit = [];
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

  resetProdModel() {
    this.prodModelCant = 0;
    this.prodModelArr = [];
    this.prodModelData = new Array<ProdMod>();
    this.filemsg2 = '';
    this.imgModEdit = [];
  }

  addDelZone() {
    var newZone = new DeliveryZoneLocal;
    newZone.num = this.delZoneCant;
    newZone.price = 0;
    newZone.districts = [];
    this.delZoneArr.push(newZone);
    this.delZoneCant++;

    // console.log("add", this.delZoneCant, this.delZoneArr);

  }

  rmvDelZone() {
    this.delZoneArr.pop();
    this.delZoneCant--;

    // console.log("rmv", this.delZoneCant, this.delZoneArr);
  }

  resetDelZone() {
    this.delZoneArr = new Array<DeliveryZoneLocal>();
    this.delZoneCant = 0;
  }

  selectFile(event, imgIndx: number) {
    this.prodImgFileArr[imgIndx] = <File>event.target.files[0];

    var mimeType = event.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.filemsg = "Solo se aceptan imagenes";
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (e: any) => {
      this.imgEdit[imgIndx] = e.target.result;
    }

    switch (imgIndx) {
      case 0:
        this.newProduct.image1 = <File>event.target.files[0];
        this.newImgs[0] = true;

        break;

      case 1:
        this.newProduct.image2 = <File>event.target.files[0];
        this.newImgs[1] = true;

        break;

      case 2:
        this.newProduct.image3 = <File>event.target.files[0];
        this.newImgs[2] = true;

        break;

      case 3:
        this.newProduct.image4 = <File>event.target.files[0];
        this.newImgs[3] = true;

        break;

      case 4:
        this.newProduct.image5 = <File>event.target.files[0];
        this.newImgs[4] = true;

        break;

      default:
        break;
    }

    this.evaluateProdImgFileArr();
  }

  selectFile2(event, imgIndx: number) {
    this.prodModelData[imgIndx].image = <File>event.target.files[0];

    var mimeType = event.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.filemsg2 = "Solo se aceptan imagenes";
      return;
    }

    // console.log(event);

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (e: any) => {
      this.imgModEdit[imgIndx] = e.target.result;
    }

    this.evaluateProdModelArrImg();
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

  updateInfo(prodData: ProductGet) {
    this.producto = prodData;
    this.prodId = prodData.id;
    // this.prodModSelect = this.producto.productModels[0].id;
    // this.pathImg = this.path + prodData.image1;
    this.changeImg(1);
    this.updatePrecioTotal();
    this.updateDelivery(prodData);
    this.getProdCommentsByProd();
  }

  passDataProd() {
    this.getCategorias();
    this.getSuppliers();
    this.newProduct = new ProductPost;

    this.resetProdImg();
    this.resetProdModel();
    this.resetDelZone();
    this.newImgs = [false, false, false, false, false];

    this.daysToSend.forEach(element => {
      if (this.producto.daysToSend.includes(element.name)) {
        element.send = true;
      } else {
        element.send = false;
      }
    });

    this.imgEdit.push(this.path + this.producto.image1);
    this.addProdImg();
    if (this.producto.image2) {
      this.imgEdit.push(this.path + this.producto.image2);
      this.addProdImg();
    }
    if (this.producto.image3) {
      this.imgEdit.push(this.path + this.producto.image3);
      this.addProdImg();
    }
    if (this.producto.image4) {
      this.imgEdit.push(this.path + this.producto.image4);
      this.addProdImg();
    }
    if (this.producto.image5) {
      this.imgEdit.push(this.path + this.producto.image5);
      this.addProdImg();
    }

    this.producto.productModels.forEach((element, index) => {
      this.addProdModel();
      this.prodModelData[index].image = element.image;
      this.prodModelData[index].name = element.name;
      this.prodModelData[index].prodImgNum = element.prodImgNum;
      this.prodModelData[index].productId = element.productId;
      this.imgModEdit.push(this.pathMod + element.image);
    });

    if (this.producto.toProv) {
      this.provDeliveryPrice = this.producto.deliveryZones[this.producto.deliveryZones.length - 1].price;
    }

    this.producto.deliveryZones.forEach((element, index) => {
      if (element.districts[0] != 'provincias') {
        var delzoneaux = new DeliveryZoneLocal;
        delzoneaux.num = index;
        delzoneaux.price = element.price;
        delzoneaux.districtSelected = '';
        delzoneaux.districts = [];
        for (let i = 0; i < element.districts.length; i++) {
          delzoneaux.districts.push(element.districts[i]);
        }
        this.delZoneArr.push(delzoneaux);
        this.delZoneCant++;
      }
    });

    this.newProduct.categoryId = this.producto.categoryId;
    this.newProduct.daysToSend = this.producto.daysToSend;
    this.newProduct.description = this.producto.description;
    this.newProduct.id = this.producto.id;
    this.newProduct.image1 = this.producto.image1;
    this.newProduct.image2 = this.producto.image2;
    this.newProduct.image3 = this.producto.image3;
    this.newProduct.image4 = this.producto.image4;
    this.newProduct.image5 = this.producto.image5;
    this.newProduct.isOffer = this.producto.isOffer;
    this.newProduct.isTrent = this.producto.isTrent;
    this.newProduct.name = this.producto.name;
    this.newProduct.numDaysToSend = this.producto.numDaysToSend;
    this.newProduct.numDaysToSend2 = this.producto.numDaysToSend2;
    this.newProduct.numSellOnWeek = this.producto.numSellOnWeek;
    this.newProduct.price = this.producto.price;
    this.newProduct.priceOffer = this.producto.priceOffer;
    this.newProduct.supplierId = this.producto.supplierId;
    this.newProduct.toProv = this.producto.toProv;
    this.newProduct.unit = this.producto.unit;
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

  updateDelivery(prod: any) {
    this.deliveryPrice = prod.deliveryZones[0].price;
    this.dist_entrega = prod.deliveryZones[0].districts[0];
    var daysToSendStart = prod.numDaysToSend + prod.numDaysToSend2;
    var daysToSendEnd = prod.numDaysToSend + prod.numDaysToSend2 + 1;

    for (let index = 0; index < 7; index++) {
      if (prod.daysToSend.includes(this.capitalize(moment().add(daysToSendStart + index, 'days').locale('es').format('dddd')))) {
        this.fecha_entrega = this.capitalize(moment().add(daysToSendStart + index, 'days').locale('es').format('dddd LL'));
        this.fecha_entrega2 = this.capitalize(moment().add(daysToSendEnd + index, 'days').locale('es').format('dddd LL'));
        break;
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
    });
  }

  addProdComment() {
    this.newProdComment.userId = this.userService.userInfo.id;
    this.newProdComment.productId = this.prodId;
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
        this.carritoItem.productModelId = this.prodModSelect;

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
    this.prodService.delete(this.prodId).subscribe(resProdDel => {

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
          this.closeModalDeleteProd.nativeElement.click();
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

  prodToUpdate() {
    this.passDataProd();
    this.onUpdate = true;
  }

  cancelUpdate() {
    this.onUpdate = false;
  }

  selectModel(mod: ProdMod) {
    this.prodModSelect = mod.id;
    this.changeImg(Number(mod.prodImgNum) + 1);
  }

  goBackPage() {
    this._location.back();
  }

  capitalize(s) {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  getCategorias() {
    this.catService.getAll().subscribe((data: CategoryGet[]) => {
      data.splice(3, 1);
      data.splice(1, 1);

      this.categorias = data;
    });
  }

  getSuppliers() {
    this.suppService.getAll().subscribe((data: Supplier[]) => {
      this.suppliers = data;
    });
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

  sendDay(){
    if (this.allDays) {
      this.allDays = false;
    }
  }

  selectDistrict(num: number) {
    if (!this.delZoneArr[num].districts.includes(this.delZoneArr[num].districtSelected)) {
      this.delZoneArr[num].districts.push(this.delZoneArr[num].districtSelected);
    }
  }

  deleteDisSelected(num: number, index: number) {
    this.delZoneArr[num].districts.splice(index, 1);
  }

  editProd(form: NgForm) {
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

        this.prodService.update(this.newProduct, this.newImgs).subscribe((data: any) => {
          this.saveEditModels();
        }, (error) => {
          console.log(error);
          this.loading = false;
          this.alertComp.errorEvent('Error al editar el producto');
        })
      } else {
        this.alertComp.errorEvent('Debes seleccionar imagenes adecuada para el producto');
      }
    }
  }

  saveEditModels() {
    this.prodModService.deleteAllFromProd(this.prodId).subscribe(() => {

      if (this.prodModelData.length > 0) {
        var contDataSaved = 0;

        this.prodModelData.forEach(element => {
          element.productId = this.prodId;

          this.prodModService.save(element).subscribe(result => {
            contDataSaved++;

            if (contDataSaved == this.prodModelData.length) {
              // console.log("models updated");
              this.saveEditDeliveryZones();
            }

          }, err => {
            console.log("error prodmod", err);
            this.loading = false;
            this.alertComp.errorEvent("error al editar los modelos");
            return;
          });

        });
      } else {
        this.saveEditDeliveryZones();
      }


    }, err => {
      console.log("error prodmod", err);
      this.loading = false;
      this.alertComp.errorEvent("error al editar los modelos");
      return;
    });
  }

  saveEditDeliveryZones() {
    var delZoneData = new Array<DeliveryZone>();
    this.delZoneArr.forEach(element => {
      var delZoneUnit = new DeliveryZone;
      delZoneUnit.price = element.price;
      delZoneUnit.productId = this.prodId;
      delZoneUnit.districts = element.districts;
      delZoneData.push(delZoneUnit);
    });

    if (this.newProduct.toProv) {

      var deliveryToProv = new DeliveryZone;
      deliveryToProv.price = this.provDeliveryPrice;
      deliveryToProv.districts = ['provincias'];
      deliveryToProv.productId = this.prodId;

      delZoneData.push(deliveryToProv);
    }

    this.delZoneService.updateFromProd(delZoneData, this.prodId).subscribe((result) => {

      this.getProd(this.prodId);
      setTimeout(() => {
        this.loading = false;
        this.onUpdate = false;
        this.alertComp.successEvent('Producto editado correctamente');
        document.getElementById('first').scrollIntoView({ behavior: 'smooth' });
      }, 3000);
    }, err => {
      console.log("error delzone", err);
      this.loading = false;
      this.alertComp.errorEvent("error al editar los delivery");
      return;
    });
  }

  getProd(prod_id: number) {
    this.prodService.getById(prod_id).subscribe((dataProd) => {
      // console.log(dataProd);

      this.updateInfo(dataProd);
    });
  }

  toCalcEnv() {
    if (this.onCalcEnv) {
      this.onCalcEnv = false;
    } else {
      this.onCalcEnv = true;
    }
  }

  getProvinciasByDepartamento(dep_id: string) {
    this.calcProv = '';
    this.calcDis = '';
    // this.dirSelec.distrito = '';
    // this.dirSelec.provincia = '';
    this.provByDep = this.provincias[dep_id];
    // this.dirSelec.departamento = this.departamentos.find(x => x.id_ubigeo === dep_id).nombre_ubigeo;
    // this.deliveryPrice = 0;
  }

  getDistritosByProvincias(prov_id: string) {
    this.calcDis = '';
    this.disByProv = this.distritos[prov_id];
    // this.dirSelec.provincia = this.provByDep.find(x => x.id_ubigeo === prov_id).nombre_ubigeo;
    // this.setDeliveryPrice();
  }

  async calcEnv(form: NgForm) {
    if (form.valid) {
      this.calculando = true;
      if (!this.producto.toProv && (this.calcDep != '3926' || this.calcProv != '3927')) {
        setTimeout(() => {
          this.alertComp.errorEvent("El producto no llega ese destino.");
          this.calculando = false;
          this.onCalcEnv = false;
          return;
        }, 1500);
      }
      if (this.producto.toProv && (this.calcDep != '3926' || this.calcProv != '3927')) {
        setTimeout(() => {
          this.deliveryPrice = this.producto.deliveryZones[this.producto.deliveryZones.length - 1].price;
          this.dist_entrega = this.calcDis;
          this.calculando = false;
          this.onCalcEnv = false;
          return;
        }, 1500);
      }

      var prodllega = false;
      if (this.calcDep == '3926' && this.calcProv == '3927') {
        await this.producto.deliveryZones.forEach(element => {
          element.districts.forEach(item => {
            if (this.calcDis == item) {
              prodllega = true;
              setTimeout(() => {
                this.deliveryPrice = element.price;
                this.dist_entrega = this.calcDis;
                this.calculando = false;
                this.onCalcEnv = false;
                return;
              }, 1500);
            }
          });
        });

        if (!prodllega) {
          setTimeout(() => {
            this.alertComp.errorEvent("El producto no llega ese destino.");
            this.calculando = false;
            this.onCalcEnv = false;
            return;
          }, 1500);
        }
      }
    }
  }
}
