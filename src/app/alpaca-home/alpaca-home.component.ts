import { Component, ElementRef, EventEmitter, OnInit, Output, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { blogItemGet } from '../classes/blogItemGet';
import { CategoryGet } from '../classes/categoryGet';
import { Supplier } from '../classes/supplier';
import { ProductsComponent } from '../products/products.component';
import { BlogService } from '../services/blog.service';
import { CategoriaService } from '../services/categoria.service';
import { ProductService } from '../services/product.service';
import { SupplierService } from '../services/supplier.service';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { SubscriptionService } from '../services/subscription.service';
import { Subscription } from '../classes/subscription';
import { SuccErrMesagesComponent } from '../succ-err-mesages/succ-err-mesages.component';
import { UserService } from '../services/user.service';
import { HelpProyectService } from '../services/help-proyect.service';
const departamentosJSON = require('../../assets/js/departamentos.json');
const provinciasJSON = require('../../assets/js/provincias.json');
const distritosJSON = require('../../assets/js/distritos.json');

@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}

@Component({
  selector: 'app-alpaca-home',
  templateUrl: './alpaca-home.component.html',
  styleUrls: ['./alpaca-home.component.css']
})
export class AlpacaHomeComponent implements OnInit {

  imgHeigh: number;

  
  categorias: CategoryGet[];
  suppliers: Supplier[];
  lastPosts: any[];
  numList: number[] = [];
  inHTMLSupp: string = '';
  suppList: Supplier[]; //para los slide de proveedores
  subInfo = new Subscription;
  accessCheck: boolean = false;
  @ViewChild('prodComp') prodComp: ProductsComponent;
  @ViewChild('alertComp') alertComp: SuccErrMesagesComponent;
  @ViewChild('closeModalInfo') closeModalInfo: ElementRef;
  depSub: string;
  provSub: string;
  cateOtros: string = '';
  departamentos: any = departamentosJSON;
  provincias: any = provinciasJSON;
  distritos: any = distritosJSON;
  provByDep: any[];
  disByProv: any[];
  dataToken: any = {};
  userNewPass: string = '';
  userNewPassRe: string = '';
  numTrees: number = 0;
  numTeachs: number = 0;

  // @ViewChild('closeModalPromociones') closeModalPromociones: ElementRef;
  @ViewChild('closeModalNewPass') closeModalNewPass: ElementRef;
  @ViewChild('openModalNewPass') openModalNewPass: ElementRef;

  constructor(
    private catService: CategoriaService,
    private routes: Router,
    private route: ActivatedRoute,
    private prodService: ProductService,
    private suppService: SupplierService,
    private blogService: BlogService,
    private subsService: SubscriptionService,
    public userService: UserService,
    private helpProyServ: HelpProyectService
  ) {
    this.getCategorias();
    this.getSuppliers();
    this.getLastPosts();

    this.route.params.subscribe((params) => {
      if (params['token']) {
        var decoToken = atob(params['token']);
        var itemsToken = decoToken.split('-/');

        if (itemsToken.length == 4) {
          this.dataToken = {
            name: itemsToken[0],
            email: itemsToken[1],
            dni: itemsToken[2],
            pass: itemsToken[3]
          }
          setTimeout(() => {
            this.openModalNewPass.nativeElement.click();
          }, 2000);
        } else {
          this.routes.navigate(['/home']);
        }
      }
    });
  }

  ngOnInit() {
    this.imgHeigh = window.innerHeight;
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    this.getCounts();
  }

  getCounts(){
    this.helpProyServ.getAll().subscribe((res) => {
      this.numTrees = res[0].num;
      this.numTeachs = res[1].num;
    });
  }

  getCategorias() {
    this.catService.getAll().subscribe((data: CategoryGet[]) => {
      this.categorias = data;
    });
  }

  getSuppliers() {
    this.suppService.getAll().subscribe((data: Supplier[]) => {
      this.suppliers = data;
      this.numList = [];
      for (let index = 0; index < data.length; index++) {
        this.numList.push(index);
      }

      this.inHTMLSupp = '';
      this.numList.forEach(pageNum => {
        if (pageNum == 0) {
          this.inHTMLSupp += `<li data-target="#carouselSupps" data-slide-to="${pageNum}" class="active" style="background-color: var(--primary3);"></li>`;
        } else {
          this.inHTMLSupp += `<li data-target="#carouselSupps" data-slide-to="${pageNum}" style="background-color: var(--primary3);"></li>`;
        }
      });

      this.suppList = data;
      if (this.suppList.length > 3) {
        this.suppList.push(data[0]);
        this.suppList.push(data[1]);
      }
    });
  }

  getLastPosts() {
    this.blogService.getAll().subscribe((data) => {
      this.lastPosts = data.slice(0, 4);
      this.lastPosts.forEach(element => {
        element.date = moment.utc(element.createdAt).format('DD/MM/YYYY').toString();
      });
    });
  }

  goToCategory(id: number) {
    this.prodService.filterType = 1;
    this.prodService.filter = String(id);
    this.routes.navigate(['/products']);
  }

  sortByBuyed() {
    this.prodService.filterType = 4;
    this.prodService.filter = '';
    this.prodComp.listProducts();
  }

  sortNormaly() {
    this.prodService.filterType = 0;
    this.prodService.filter = '';
    this.prodComp.listProducts();
  }

  filterProds(type: number) {
    switch (type) {
      case 1:
        this.sortNormaly();
        break;
      case 2:

        break;
      case 3:
        this.sortByBuyed();
        break;

      default:
        break;
    }
  }

  // subscribeUser(form: NgForm) {
  //   if (form.valid) {
  //     this.subInfo.phone = this.subInfo.phone.replace(/-+/g, "");
  //     this.subsService.save(this.subInfo).subscribe((data) => {
  //       this.closeModalPromociones.nativeElement.click();
  //       this.subInfo = new Subscription;
  //       this.alertComp.successEvent('Se han guardado tus datos, muchas gracias.')
  //     }, (err) => {
  //       this.alertComp.errorEvent('Ha ocurrido un error al guardar tus datos.')
  //     });
  //   }
  // }


  // telephone_eval() {
  //   if (this.subInfo.phone.length == 3 || this.subInfo.phone.length == 7) {
  //     this.subInfo.phone += '-';
  //   }
  // }

  goToSupplier(suppName: string) {
    var suppLink = suppName.replace(/\s+/g, "-");
    this.routes.navigate(['/fuerza/' + suppLink]);
  }

  selectClientType(type: number) {
    this.subInfo = new Subscription;
    this.accessCheck = false;
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
      this.subInfo.phone = this.subInfo.phone.replace(/-+/g, "");
      this.subsService.save(this.subInfo).subscribe((data) => {
        this.closeModalInfo.nativeElement.click();
        this.alertComp.successEvent('Se han guardado tus datos, muchas gracias.')
      }, (err) => {
        this.alertComp.errorEvent('Ha ocurrido un error al guardar tus datos.')
      });
    }
  }

  getProvinciasByDepartamento(dep_id: string) {
    this.provSub = '';
    this.subInfo.distrito = '';
    this.subInfo.provincia = '';
    this.provByDep = this.provincias[dep_id];
    this.subInfo.departamento = this.departamentos.find(x => x.id_ubigeo === dep_id).nombre_ubigeo;
  }

  getDistritosByProvincias(prov_id: string) {
    this.subInfo.distrito = '';
    this.disByProv = this.distritos[prov_id];
    this.subInfo.provincia = this.provByDep.find(x => x.id_ubigeo === prov_id).nombre_ubigeo;
  }

  // modalProm(){
  //   this.subInfo = new Subscription;
  // }

  newPass(form: NgForm) {

    if (form.valid) {
      if (this.userNewPass == this.userNewPassRe) {

        var dataNewPass = {
          data: this.dataToken,
          newPass: this.userNewPass
        }

        this.userService.newPassStep2(dataNewPass).subscribe((result) => {
          this.alertComp.successEvent("Se ha actualizado la contraseña de la cuenta.");
          this.closeModalNewPass.nativeElement.click();
        }, (error) => {
          this.alertComp.errorEvent("Ocurrio un error al querer actualizar la contraseña.")
        })

      } else {
        this.alertComp.errorEvent("Los campos no coinciden.")
      }
    }

  }

}
