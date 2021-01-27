import { Component, OnInit } from '@angular/core';
import { OrderGet } from '../classes/order';
import { OrderService } from '../services/order.service';
import * as moment from 'moment';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  orders: any[] = [];

  constructor(
    private orderService: OrderService
  ) {
    this.listAll();
  }

  ngOnInit(): void {
  }

  listAll() {
    this.orderService.getAll().subscribe((data) => {
      this.orders = data;
      this.orders.forEach(element => {
        element.date = moment.utc(element.createdAt).format('DD/MM/YYYY').toString();
      });
    })
  }

}
