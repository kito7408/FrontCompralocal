import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.get<OrderGet[]>(this.url, { headers: headers });
  }

  getById(id: number): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + id;
    return this.http.get<any>(newUrl, { headers: headers });
  }

  getByUserId(id: number): Observable<OrderGet[]> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/user/' + id;
    return this.http.get<OrderGet[]>(newUrl, { headers: headers });
  }

  save(item: OrderPost): Observable<OrderPost> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.post<OrderPost>(this.url, item, { headers: headers });
  }

  update(item: OrderPost): Observable<OrderPost> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + item.id;
    return this.http.put<OrderPost>(newUrl, item, { headers: headers });
  }

  delete(id: number): Observable<OrderPost> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + id;
    return this.http.delete<OrderPost>(newUrl, { headers: headers });
  }

  sendUserMail(dataOrder: OrderGet): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/sendUserMail';
    return this.http.put<any>(newUrl, dataOrder, { headers: headers });
  }

  sendAdminMail(dataOrder: OrderGet): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/sendAdminMail';
    return this.http.put<any>(newUrl, dataOrder, { headers: headers });
  }

  sendPagoPendienteMail(dataOrder: OrderGet): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/sendPagoPendienteMail';
    return this.http.put<any>(newUrl, dataOrder, { headers: headers });
  }

  sendThanksUserMail(dataOrder: OrderGet): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/sendThanksUserMail';
    return this.http.put<any>(newUrl, dataOrder, { headers: headers });
  }

  sendNewSuppMail(suppInfo: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/sendNewSuppMail';
    return this.http.put<any>(newUrl, suppInfo, { headers: headers });
  }
}
