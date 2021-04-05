import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartGet } from '../classes/cartGet';
import { CartPost } from '../classes/cartPost';
import { Tarjeta } from '../classes/tarjeta';
import { Constants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartInfo: CartGet[] = [];
  cartQuantity: number = 0;
  cartTotalPrice: number = 0;
  // publicKey = "pk_test_20064752bb0ebab1";    //mia
  publicKey = "pk_live_CFjWE3PZo8yAgnQm";
  private backend_url = Constants.URL_BACKEND;
  private url = this.backend_url + '/cart';
  private culqiURL = "https://secure.culqi.com/v2"; //api culqi

  constructor(private http: HttpClient) { }

  getAll(): Observable<CartGet[]> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.get<CartGet[]>(this.url, { headers: headers });
  }

  getById(id: number): Observable<CartGet> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + id;
    return this.http.get<CartGet>(newUrl, { headers: headers });
  }

  getByUserId(id: number): Observable<CartGet[]> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    
    const newUrl = this.url + '/user/' + id;
    return this.http.get<CartGet[]>(newUrl, { headers: headers });
  }

  save(item: CartPost): Observable<CartPost> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.post<CartPost>(this.url, item, { headers: headers });
  }

  saveMany(cartArr: CartPost[]): Observable<CartGet[]> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/many';
    return this.http.post<CartGet[]>(newUrl, cartArr, { headers: headers });
  }

  update(item: CartPost): Observable<CartPost> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + item.id;
    return this.http.put<CartPost>(newUrl, item, { headers: headers });
  }

  delete(id: number): Observable<CartPost> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + id;
    return this.http.delete<CartPost>(newUrl, { headers: headers });
  }

  sendToCulqi(tarjeta: Tarjeta): Observable<any> {
    const newUrl = this.culqiURL + '/tokens';
    const headers = new HttpHeaders()
      .set('Content-type', 'application/json')
      .append('Authorization', 'Bearer ' + this.publicKey);
    return this.http.post(newUrl, tarjeta, { headers: headers });
  }

  // crearCargoCulqi(dataCargo: any): Observable<any> {
  //   const newUrl = this.culqiURL + '/charges'
  //   const headers = new HttpHeaders()
  //     .set('Content-type', 'application/json')
  //     .append('Authorization', 'Bearer ' + this.publicKey);
  //   return this.http.post(newUrl, dataCargo, { headers: headers });
  // }

  crearCargo(dataCargo: any): Observable<any>{
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/culqi/charge'
    return this.http.post(newUrl, dataCargo, { headers: headers });
  }

  crearClienteCulqi(dataCliente: any): Observable<any>{
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/culqi/customer'
    return this.http.post(newUrl, dataCliente, { headers: headers });
  }

  crearCardCulqi(dataCard: any): Observable<any>{
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/culqi/card'
    return this.http.post(newUrl, dataCard, { headers: headers });
  }

  crearSubCulqi(dataSub: any): Observable<any>{
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/culqi/subscription'
    return this.http.post(newUrl, dataSub, { headers: headers });
  }

  buyCart(userId: number, orderId: number){
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/userbuy';
    return this.http.post(newUrl, {userId: userId, orderId: orderId}, { headers: headers });
  }
}
