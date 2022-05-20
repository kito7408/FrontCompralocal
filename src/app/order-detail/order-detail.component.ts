import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderGet } from '../classes/order';
import { OrderService } from '../services/order.service';
import * as moment from 'moment';
import { UserService } from '../services/user.service';
import { SuccErrMesagesComponent } from '../succ-err-mesages/succ-err-mesages.component';
import { HelpProyectService } from '../services/help-proyect.service';
import { HelpProyect } from '../classes/helpProyect';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  fromBuy: boolean;
  order: any;
  orderId: number;

  @ViewChild('alertComp') alertComp: SuccErrMesagesComponent;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    public userService: UserService,
    private helpProyServ: HelpProyectService
  ) {
    this.fromBuy = false;
    this.route.params.subscribe((params) => {
      this.orderId = params['id'];
      this.getOrder(this.orderId);
    });
  }

  ngOnInit(): void {
  }

  getOrder(id: number) {
    this.orderService.getById(id).subscribe((orderData) => {
      this.order = orderData;
      this.order.date = moment(this.order.createdAt).locale('es').format('LL');
      this.order.carts.forEach(element => {
        var daysToSendStart = element.product.numDaysToSend + element.product.numDaysToSend2;
        var daysToSendEnd = element.product.numDaysToSend + element.product.numDaysToSend2 + 2;

        for (let index = 0; index < 7; index++) {
          if (element.product.daysToSend.includes(this.capitalize(moment(this.order.createdAt).add(daysToSendStart + index, 'days').locale('es').format('dddd')))) {
            element.fecha_entrega = this.capitalize(moment(this.order.createdAt).add(daysToSendStart + index, 'days').locale('es').format('dddd LL'));
            element.fecha_entrega2 = this.capitalize(moment(this.order.createdAt).add(daysToSendEnd + index, 'days').locale('es').format('dddd LL'));
            break;
          }
        }
      });
    });
  }

  capitalize(s) {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  changeState(state: string) {
    this.order.paymentState = state;

    this.orderService.update(this.order).subscribe((result) => {
      this.alertComp.successEvent('Estado de la orden actualizado');
    });
    if (state == 'Entregado') {
      this.orderService.sendThanksUserMail(this.order).subscribe((data) => {
        console.log('mail send');
        this.updateCounts();
      });
    }
  }

  updateCounts(){
    var toHelp = this.order.productsPrice * 0.01;
    toHelp = Math.round((toHelp) * 100) / 100;

    var auxHelp = new HelpProyect;
    auxHelp.id = this.order.helpproyect.id;
    auxHelp.name = this.order.helpproyect.name;
    auxHelp.num = this.order.helpproyect.num;
    auxHelp.money = toHelp;
    
    this.helpProyServ.update(auxHelp).subscribe((res) => {
      console.log("updated help");
    });
  }

  // Función para testear los correos
  sendM() {
    this.orderService.sendUserMail(this.order).subscribe((data) => {
      setTimeout(() => {
        this.orderService.sendAdminMail(this.order).subscribe((data2) => {
          if (this.order.paymentMethod != 'culqi') {
            setTimeout(() => {
              this.orderService.sendPagoPendienteMail(this.order).subscribe((data3) => {
                console.log('mail send');

              });
            }, 1000);
          }
        });
      }, 1000);
    });
  }

  sendMailRecordatorio() {
    this.orderService.sendPagoPendienteMail(this.order).subscribe((data3) => {
      this.alertComp.successEvent('Se ha enviado el correo de recordatorio.');
    });
  }
}
