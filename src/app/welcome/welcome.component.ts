import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CategoryGet } from '../classes/categoryGet';
import { Subscription } from '../classes/subscription';
import { CategoriaService } from '../services/categoria.service';
import { SubscriptionService } from '../services/subscription.service';
import { SuccErrMesagesComponent } from '../succ-err-mesages/succ-err-mesages.component';
const departamentosJSON = require('../../assets/js/departamentos.json');
const provinciasJSON = require('../../assets/js/provincias.json');
const distritosJSON = require('../../assets/js/distritos.json');

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  imgHeigh: any;
  subInfo = new Subscription;
  categorias: CategoryGet[];
  cateOtros: string = '';
  accessCheck: boolean = false;
  depSub: string = '';
  provSub: string = '';
  provByDep: any[];
  disByProv: any[];
  rucOp: string = 'si';
  departamentos: any = departamentosJSON;
  provincias: any = provinciasJSON;
  distritos: any = distritosJSON;
  @ViewChild('closeModalInfo') closeModalInfo: ElementRef;
  @ViewChild('alertComp') alertComp: SuccErrMesagesComponent;

  constructor(
    private subsService: SubscriptionService,
    private cateService: CategoriaService
  ) { }

  ngOnInit(): void {
    this.imgHeigh = window.innerHeight;
    this.getCategorias();
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

  getCategorias(){
    this.cateService.getAll().subscribe((resCate) => {
      this.categorias = resCate;
    });
  }

  telephone_eval() {
    if (this.subInfo.phone.length == 3 || this.subInfo.phone.length == 7) {
      this.subInfo.phone += '-';
    }
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

  getProvinciasByDepartamento(dep_id: string){
    this.provSub = '';
    this.subInfo.distrito = '';
    this.subInfo.provincia = '';
    this.provByDep = this.provincias[dep_id];
    this.subInfo.departamento = this.departamentos.find(x => x.id_ubigeo === dep_id).nombre_ubigeo;
  }

  getDistritosByProvincias(prov_id: string){
    this.subInfo.distrito = '';
    this.disByProv = this.distritos[prov_id];
    this.subInfo.provincia = this.provByDep.find(x => x.id_ubigeo === prov_id).nombre_ubigeo;
  }
}
