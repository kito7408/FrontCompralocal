import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartGet } from '../classes/cartGet';
import { CartPost } from '../classes/cartPost';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartInfo: CartGet[] = [];
  cartQuantity: number = 0;
  cartTotalPrice: number = 0;
  private url = '/api/cart';
  someChange: Observable<String>;

  constructor(private http: HttpClient) { }

  getAll(): Observable<CartGet[]>{
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

  save(item: CartPost):Observable<CartPost>{
    return this.http.post<CartPost>(this.url, item);
  }

  saveMany(cartArr: CartPost[]): Observable<CartGet[]>{
    const newUrl = this.url + '/many';
    return this.http.post<CartGet[]>(newUrl, cartArr);
  }

  update(item: CartPost): Observable<CartPost> {
    const newUrl = this.url + '/' + item.id;
    return this.http.put<CartPost>(newUrl,item);
  }

  delete(id: number): Observable<CartPost> {
    const newUrl = this.url + '/' + id;
    return this.http.delete<CartPost>(newUrl);
  }

  // someChange(some: string): Observable<String> {
  //   const aux = new Observable<String>();
  //   console.log(some + ' algo');
  //   return aux;
  // }

}
