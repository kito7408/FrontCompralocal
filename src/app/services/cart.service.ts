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
  publicKey = "pk_test_20064752bb0ebab1";
  private backend_url = Constants.URL_BACKEND;
  private url = this.backend_url + '/cart';
  private culqiURL = "https://secure.culqi.com/v2"; //api culqi

  constructor(private http: HttpClient) { }

  getAll(): Observable<CartGet[]> {
    return this.http.get<CartGet[]>(this.url);
  }

  getById(id: number): Observable<CartGet> {
    const newUrl = this.url + '/' + id;
    return this.http.get<CartGet>(newUrl);
  }

  getByUserId(id: number): Observable<CartGet[]> {
    const newUrl = this.url + '/user/' + id;
    return this.http.get<CartGet[]>(newUrl);
  }

  save(item: CartPost): Observable<CartPost> {
    return this.http.post<CartPost>(this.url, item);
  }

  saveMany(cartArr: CartPost[]): Observable<CartGet[]> {
    const newUrl = this.url + '/many';
    return this.http.post<CartGet[]>(newUrl, cartArr);
  }

  update(item: CartPost): Observable<CartPost> {
    const newUrl = this.url + '/' + item.id;
    return this.http.put<CartPost>(newUrl, item);
  }

  delete(id: number): Observable<CartPost> {
    const newUrl = this.url + '/' + id;
    return this.http.delete<CartPost>(newUrl);
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
    const newUrl = this.url + '/culqi'
    return this.http.post(newUrl, dataCargo);
  }

  buyCart(userId: number, orderId: number){
    const newUrl = this.url + '/userbuy';
    return this.http.post(newUrl, {userId: userId, orderId: orderId});
  }
}
