import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Supplier } from '../classes/supplier';
import { Tarjeta } from '../classes/tarjeta';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { SupplierService } from '../services/supplier.service';
import { SuccErrMesagesComponent } from '../succ-err-mesages/succ-err-mesages.component';
const departamentosJSON = require('../../assets/js/departamentos.json');
const provinciasJSON = require('../../assets/js/provincias.json');
const distritosJSON = require('../../assets/js/distritos.json');

@Component({
  selector: 'app-plan-detail',
  templateUrl: './plan-detail.component.html',
  styleUrls: ['./plan-detail.component.css']
})
export class PlanDetailComponent implements OnInit {

  planName: string = '';
  factInfo = new Supplier;
  starsSelected: boolean = false;
  departamentos: any = departamentosJSON;
  provincias: any = provinciasJSON;
  distritos: any = distritosJSON;
  provByDep: any[];
  disByProv: any[];
  depFact: string = '';
  provFact: string = '';
  paymentMethod: string = '';
  imgHeigh: number;
  planCost: number = 59;
  tarjeta = new Tarjeta;
  paying: boolean;
  short_year: string = '';
  fact_name: string = '';
  fact_last_name: string = '';
  subTime: string = 'mensual';

  @ViewChild('closeModalPayment') closeModalPayment: ElementRef;
  @ViewChild('modalCulqi') modalCulqi: ElementRef;
  @ViewChild('modalFinal') modalFinal: ElementRef;
  @ViewChild('alertComp') alertComp: SuccErrMesagesComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private suppService: SupplierService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.imgHeigh = window.innerHeight;
  }

  getProvinciasByDepartamento(dep_id: string) {
    this.provFact = '';
    this.factInfo.distrito = '';
    this.factInfo.provincia = '';
    this.provByDep = this.provincias[dep_id];
    this.factInfo.departamento = this.departamentos.find(x => x.id_ubigeo === dep_id).nombre_ubigeo;
  }

  getDistritosByProvincias(prov_id: string) {
    this.factInfo.distrito = '';
    this.disByProv = this.distritos[prov_id];
    this.factInfo.provincia = this.provByDep.find(x => x.id_ubigeo === prov_id).nombre_ubigeo;
  }

  closeModalTarjetaInfo() {
    this.paying = false;
    this.tarjeta = new Tarjeta;
    this.short_year = '';
    this.closeModalPayment.nativeElement.click();
  }

  enviarInfoTarjeta() {
    this.paying = true;
    this.tarjeta.expiration_year = "20" + this.short_year;
    this.tarjeta.card_number = this.tarjeta.card_number.replace(/\s+/g, "");

    this.cartService.sendToCulqi(this.tarjeta).subscribe((dataToken) => {
      // console.log("info culqi token",dataToken);

      var infoClient = {
        first_name: this.fact_name,
        last_name: this.fact_last_name,
        email: this.factInfo.email,
        address: this.factInfo.direccion,
        address_city: this.factInfo.provincia,
        country_code: "PE",
        phone_number: this.factInfo.phone_contact
      }

      this.cartService.crearClienteCulqi(infoClient).subscribe((dataCliente) => {

        var infoCard = {
          customer_id: dataCliente.id,
          token_id: dataToken.id
        }

        this.cartService.crearCardCulqi(infoCard).subscribe((dataCard) => {

          var infoSubscription = {
            card_id: dataCard.id,
            plan_id: ""
          }

          switch (this.subTime) {
            case 'mensual':
              infoSubscription.plan_id = "pln_live_MdQZ9bc95X7BZX1R";
              // infoSubscription.plan_id = "pln_live_ElFLv5d8IBK0eQZ6";  //3 soles
              break;

            case 'semestral':
              infoSubscription.plan_id = "pln_live_MyDwSp7HW2bfpabF";
              break;

            case 'anual':
              infoSubscription.plan_id = "pln_live_gMIQSFT6VuuE0pzq";
              break;

            default:
              break;
          }

          this.cartService.crearSubCulqi(infoSubscription).subscribe((dataSub) => {

            this.createSupp();
          }, (errSub) => {
            console.log("errSub ",errSub);
            this.closeModalTarjetaInfo();
            this.alertComp.errorEvent(errSub.merchant_message)
          });

        }, (errCard) => {
          console.log("errCard ",errCard);
          this.closeModalTarjetaInfo();
          this.alertComp.errorEvent(errCard.merchant_message)
        });

      }, (errClient) => {
        console.log("errClient ",errClient);
        this.closeModalTarjetaInfo();
        this.alertComp.errorEvent(errClient.merchant_message)
      });



      // var infoCargo = {
      //   amount: this.planCost * 100,
      //   currency_code: 'PEN',
      //   email: dataToken.email,
      //   source_id: dataToken.id
      // }

      // this.cartService.crearCargo(infoCargo).subscribe((dataCargo) => {
      //   // console.log("cargo creado correctamente", dataCargo);
      //   // alert("cargo creado correctamente")
      //   this.createSupp();
      // }, (error) => {
      //   console.log(error);
      //   this.closeModalTarjetaInfo();
      //   this.alertComp.errorEvent("Ocurrió un error al realizar el pago.")
      // });
    }, (errToken) => {
      console.log("errToken ",errToken);
      this.closeModalTarjetaInfo();
      this.alertComp.errorEvent(errToken.merchant_message)
    });
  }

  pagar() {
    this.tarjeta.email = this.factInfo.email;
    this.modalCulqi.nativeElement.click();
  }

  sendMail(suppInfo: any) {
    // suppInfo.token = btoa(suppInfo.name + '-/' + suppInfo.email + '-/' + suppInfo.contact_person + '-/' + suppInfo.id);
    this.orderService.sendNewSuppMail(suppInfo).subscribe((data) => {
      console.log('mail send');
    });
  }

  createSupp() {
    this.factInfo.contact_person = this.fact_name + ' ' + this.fact_last_name;
    this.suppService.save(this.factInfo).subscribe((dataSupp) => {
      this.closeModalTarjetaInfo();
      this.alertComp.successEvent('Tu información ha sido registrada.');
      this.modalFinal.nativeElement.click();
      this.sendMail(dataSupp.data);
    });
  }

  card_number_eval() {
    if (this.tarjeta.card_number.length == 4 || this.tarjeta.card_number.length == 9 ||
      this.tarjeta.card_number.length == 14) {
      this.tarjeta.card_number += ' ';
    }
  }

  setSub(subType: string) {
    this.subTime = subType;
    switch (subType) {
      case 'mensual':
        this.planCost = 59;
        break;

      case 'semestral':
        this.planCost = 354;
        break;

      case 'anual':
        this.planCost = 708;
        break;

      default:
        break;
    }
  }
}
