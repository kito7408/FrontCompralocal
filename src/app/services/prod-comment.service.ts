import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProdCommentGet, ProdCommentPost } from '../classes/prodComment';
import { Constants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ProdCommentService {

  private backend_url = Constants.URL_BACKEND;
  private url = this.backend_url + '/prodcomment';

  constructor(private http: HttpClient) { }

  getAll(): Observable<ProdCommentGet[]>{
    return this.http.get<ProdCommentGet[]>(this.url);
  }

  getById(id: number): Observable<ProdCommentGet> {
    const newUrl = this.url + '/' + id;
    return this.http.get<ProdCommentGet>(newUrl);
  }

  getByUserId(id: number): Observable<ProdCommentGet[]> {
    const newUrl = this.url + '/user/' + id;
    return this.http.get<ProdCommentGet[]>(newUrl);
  }

  getByProductId(id: number): Observable<ProdCommentGet[]> {
    const newUrl = this.url + '/product/' + id;
    return this.http.get<ProdCommentGet[]>(newUrl);
  }

  getByUserAndProductId(user_id: number, product_id: number): Observable<ProdCommentGet[]> {
    const data = {
      userId: user_id,
      productId: product_id
    }
    const newUrl = this.url + '/user-prod/';
    return this.http.put<ProdCommentGet[]>(newUrl, data);
  }

  save(data: ProdCommentPost):Observable<ProdCommentPost>{
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.post<ProdCommentPost>(this.url,data, { headers: headers });
  }

  update(data: ProdCommentPost): Observable<ProdCommentPost> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + data.id;
    return this.http.put<ProdCommentPost>(newUrl,data, { headers: headers });
  }

  delete(id: number): Observable<ProdCommentPost> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + id;
    return this.http.delete<ProdCommentPost>(newUrl, { headers: headers });
  }

}
