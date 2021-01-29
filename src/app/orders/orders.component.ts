import { Component, OnInit } from '@angular/core';
import { OrderGet } from '../classes/order';
import { OrderService } from '../services/order.service';
import * as moment from 'moment';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  orders: any[] = [];
  noOrders: boolean;

  constructor(
    private orderService: OrderService,
    private userService: UserService
  ) {
    this.noOrders = false;
    if (this.userService.userInfo.userTypeId == 1) {
      this.listAll();
    } else {
      this.listByUserId(this.userService.userInfo.id);
    }
  }

  ngOnInit(): void {
  }

  listByUserId(user_id: number) {
    this.orderService.getByUserId(user_id).subscribe((data) => {
      this.orders = data;
      this.orders.forEach(element => {
        element.date = moment.utc(element.createdAt).format('DD/MM/YYYY').toString();
      });
      if (this.orders.length == 0) {
        this.noOrders = true;
      }
    });
  }

  listAll() {
    this.orderService.getAll().subscribe((data) => {
      this.orders = data;
      this.orders.forEach(element => {
        element.date = moment.utc(element.createdAt).format('DD/MM/YYYY').toString();
      });
      if (this.orders.length == 0) {
        this.noOrders = true;
      }
    });
  }

}
