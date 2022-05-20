import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { from } from 'rxjs';
import { CategoryGet } from '../classes/categoryGet';
import { ProductPost } from '../classes/productPost';
import { Supplier } from '../classes/supplier';
import { ProductsComponent } from '../products/products.component';
import { CategoriaService } from '../services/categoria.service';
import { ProductService } from '../services/product.service';
import { SupplierService } from '../services/supplier.service';
import { UserService } from '../services/user.service';
import { SuccErrMesagesComponent } from '../succ-err-mesages/succ-err-mesages.component';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements OnInit {

  // lat: number;
  // lng: number;
  // zoom: number;
  // mapTypeId: String;
  @ViewChild('prodComp') prodComp: ProductsComponent;

  suppName: string;
  supplier: Supplier;
  educacion: boolean;
  reforestacion: boolean;
  tokenSupp: string;
  fromTokenRoute: boolean = false;
  prodImgCant: number = 0;
  prodImgArr: number[] = [];
  prodImgFileArr = new Array<File>();
  newProduct = new ProductPost;
  filemsg: string;
  loading: boolean = false;
  unabling: boolean = false;
  categorias: CategoryGet[];
  onlyReadProds: boolean = false;
  suppOnEdit: boolean = false;
  suppImgURL1: string = '';
  suppImgURL2: string = '';
  suppImg1: File;
  suppImg2: File;
  suppfilemsg1: string = '';
  suppfilemsg2: string = '';
  changeImg1: boolean = false;
  changeImg2: boolean = false;
  suppPrevInfo: Supplier;

  @ViewChild('closeAddProductModal') closeAddProductModal: ElementRef;
  @ViewChild('alertComp') alertComp: SuccErrMesagesComponent;

  @Output() logEvent = new EventEmitter;

  constructor(
    private suppService: SupplierService,
    private route: ActivatedRoute,
    private router: Router,
    private prodService: ProductService,
    private catService: CategoriaService,
    public userService: UserService
  ) {
    // this.lat = 40;
    // this.lng = -3;
    // this.zoom = 6;
    // this.mapTypeId = 'terrain';

    if (this.router.url == '/educacion') {
      this.educacion = true;
    } else if (this.router.url == '/reforestacion') {
      this.reforestacion = true;
    } else {
      this.route.params.subscribe((params) => {
        if (params['name']) {
          this.suppName = params['name'];
          this.suppName = this.suppName.replace(/-+/g, " ");
          this.suppService.getByName(this.suppName).subscribe((data) => {
            this.supplier = data;
            this.supplier.description = this.supplier.description.replace(/\n/g, "<br>");
            this.prodService.filterType = 5;
            this.prodService.filter = String(this.supplier.id);
            this.prodComp.listProducts();
          });
        } else {
          this.tokenSupp = params['token'];
          var decoToken = atob(this.tokenSupp);
          var itemsToken = decoToken.split('-/');

          if (itemsToken.length == 4) {
            var dataToken = {
              name: itemsToken[0],
              email: itemsToken[1],
              contact_person: itemsToken[2],
              id: itemsToken[3]
            }
            this.suppService.getByCoded(dataToken).subscribe(dataSup => {
              if (dataSup) {
                this.supplier = dataSup;
                this.prodService.filterType = 5;
                this.prodService.filter = String(dataSup.id);
                this.fromTokenRoute = true;
                this.getCategorias();
                this.onlyReadProds = true;
                this.prodComp.listProducts();
              } else {
                this.router.navigate(['/home']);
              }
            });
          } else {
            this.router.navigate(['/home']);
          }
        }
      });
    }
  }

  ngOnInit() {
  }

  getCategorias() {
    this.catService.getAll().subscribe((data: CategoryGet[]) => {
      this.categorias = data;
    });
  }

  newProdF() {
    this.logEvent.emit('newProdFromSupp ' + this.supplier.id);
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

  selectFile(event, imgIndx: number) {
    this.prodImgFileArr[imgIndx] = <File>event.target.files[0];
    this.evaluateProdImgFileArr();
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

  addProd(form: NgForm) {
    if (form.valid) {
      if (this.filemsg == '') {
        this.loading = true;
        this.newProduct.image1 = this.prodImgFileArr[0];
        this.newProduct.image2 = this.prodImgFileArr[1];
        this.newProduct.image3 = this.prodImgFileArr[2];
        this.newProduct.image4 = this.prodImgFileArr[3];
        this.newProduct.image5 = this.prodImgFileArr[4];

        this.newProduct.numSellOnWeek = 0;
        this.newProduct.isTrent = false;
        this.newProduct.supplierId = this.supplier.id;
        this.prodService.save(this.newProduct).subscribe((data: any) => {
          this.prodComp.listProducts();
          this.closeAddProductModal.nativeElement.click();
          this.newProduct = new ProductPost;
          this.loading = false;
          this.alertComp.successEvent('Producto agregado correctamente')
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

  goToEditSupp() {
    this.suppImgURL1 = 'https://compralocal-images.s3.us-east-2.amazonaws.com/suppliers/' + this.supplier.image;
    this.suppImgURL2 = 'https://compralocal-images.s3.us-east-2.amazonaws.com/suppliers/' + this.supplier.image_person;
    this.changeImg1 = false;
    this.changeImg2 = false;
    this.suppPrevInfo = this.supplier;
    this.suppOnEdit = true;

    this.supplier.description = this.supplier.description.replace(/<br>/g,"\n");
  }

  cancelEditSupp() {
    this.suppOnEdit = false;
    this.supplier = this.suppPrevInfo;
    this.supplier.description = this.supplier.description.replace(/\n/g, "<br>");
  }

  selectFileSupp1(event) {

    if (!event.target.files[0] || event.target.files[0].length == 0) {
      this.suppfilemsg1 = 'Debes seleccionar una imagen';
      return;
    }

    var mimeType = event.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.suppfilemsg1 = "Solo se aceptan imagenes";
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (e: any) => {
      this.suppImgURL1 = e.target.result;
    }

    this.suppImg1 = <File>event.target.files[0];

    this.changeImg1 = true;

    this.suppfilemsg1 = '';
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

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (e: any) => {
      this.suppImgURL2 = e.target.result;
    }

    this.suppImg2 = <File>event.target.files[0];

    this.changeImg2 = true;

    this.suppfilemsg2 = '';
  }

  saveSuppChanges() {
      if (this.suppfilemsg1 == '' && this.suppfilemsg2 == '') {
        this.loading = true;
        var suppDataToSend : any;
        suppDataToSend = this.supplier;
        suppDataToSend.image = this.suppImg1;
        suppDataToSend.image_person = this.suppImg2;
        suppDataToSend.changeImg1 = this.changeImg1;
        suppDataToSend.changeImg2 = this.changeImg2;

        this.suppService.update(suppDataToSend).subscribe((data: any) => {
          this.supplier = data.data;
          this.supplier.description = this.supplier.description.replace(/\n/g, "<br>");
          setTimeout(() => {
            this.loading = false;
            this.suppOnEdit = false;
            this.alertComp.successEvent('Proveedor editado correctamente')
          }, 5000);
          
        }, (error) => {
          console.log(error);
          this.loading = false;
          this.alertComp.errorEvent('Error al editar proveedor')
        });
      } else {
        this.alertComp.errorEvent('Selecciona imagenes adecuadas')
      }
  }

  unableSupp(){
    this.unabling = true;
    var suppDataToSend : any;
    suppDataToSend = this.supplier;
    suppDataToSend.image = this.suppImg1;
    suppDataToSend.image_person = this.suppImg2;
    suppDataToSend.changeImg1 = this.changeImg1;
    suppDataToSend.changeImg2 = this.changeImg2;
    suppDataToSend.available = false;

    this.suppService.update(suppDataToSend).subscribe((data: any) => {

      this.alertComp.successEvent('Proveedor inhabilitado');
      this.logEvent.emit('unableSupp');
      setTimeout(() => {
        this.unabling = false;
        this.router.navigate(['/home']);
      }, 2000);

    }, (error) => {
      console.log(error);
      this.loading = false;
      this.alertComp.errorEvent('Error al inhabilitar al proveedor');
    });
  }
}
