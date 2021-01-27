import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderGet } from '../classes/order';
import { OrderService } from '../services/order.service';
import * as moment from 'moment';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  fromBuy: boolean;
  order: any;
  orderId: number;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
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

  async sendM(){
    this.orderService.sendUserMail(this.order).subscribe((data)=> {
      setTimeout(() => {
        this.orderService.sendAdminMail(this.order).subscribe((data2) => {
        });
      }, 3000);
    });
  }
}
