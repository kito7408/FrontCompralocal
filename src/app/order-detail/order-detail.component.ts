import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderGet } from '../classes/order';
import { OrderService } from '../services/order.service';
import * as moment from 'moment';
import { UserService } from '../services/user.service';
import { SuccErrMesagesComponent } from '../succ-err-mesages/succ-err-mesages.component';

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
    public userService: UserService
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
    })
  }

  changeState(state: string) {
    this.order.paymentState = state;

    this.orderService.update(this.order).subscribe((result) => {
      this.alertComp.successEvent('Estado de la orden actualizado');
    });
    if (state == 'Entregado') {
      this.orderService.sendThanksUserMail(this.order).subscribe((data) => {
        console.log('mail send');
      });
    }
  }

  // Función para testear los correos
  sendM() {
    this.orderService.sendUserMail(this.order).subscribe((data) => {
      setTimeout(() => {
        this.orderService.sendAdminMail(this.order).subscribe((data2) => {
          if (this.order.paymentMethod != 'culqi') {
            setTimeout(() => {
              this.orderService.sendPagoPendienteMail(this.order).subscribe((data3)=> {
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
