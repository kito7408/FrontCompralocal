import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderGet, OrderPost } from '../classes/order';
import { Constants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private backend_url = Constants.URL_BACKEND;
  private url = this.backend_url + '/order';

  constructor(private http: HttpClient) { }

  getAll(): Observable<OrderGet[]> {
    return this.http.get<OrderGet[]>(this.url);
  }

  getById(id: number): Observable<any> {
    const newUrl = this.url + '/' + id;
    return this.http.get<any>(newUrl);
  }

  getByUserId(id: number): Observable<OrderGet[]> {
    const newUrl = this.url + '/user/' + id;
    return this.http.get<OrderGet[]>(newUrl);
  }

  save(item: OrderPost): Observable<OrderPost> {
    return this.http.post<OrderPost>(this.url, item);
  }

  update(item: OrderPost): Observable<OrderPost> {
    const newUrl = this.url + '/' + item.id;
    return this.http.put<OrderPost>(newUrl, item);
  }

  delete(id: number): Observable<OrderPost> {
    const newUrl = this.url + '/' + id;
    return this.http.delete<OrderPost>(newUrl);
  }

  sendUserMail(dataOrder: OrderGet): Observable<any> {
    const newUrl = this.url + '/sendUserMail';
    return this.http.put<any>(newUrl, dataOrder);
  }

  sendAdminMail(dataOrder: OrderGet): Observable<any> {
    const newUrl = this.url + '/sendAdminMail';
    return this.http.put<any>(newUrl, dataOrder);
  }
}
