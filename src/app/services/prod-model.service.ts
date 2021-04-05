import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from '../constants';
import { ProdMod } from '../classes/prodModel';

@Injectable({
  providedIn: 'root'
})
export class ProdModelService {

  private backend_url = Constants.URL_BACKEND;
  private url = this.backend_url + '/prodmodel';

  constructor(private http: HttpClient) { }

  getAll(): Observable<ProdMod[]>{
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.get<ProdMod[]>(this.url, { headers: headers });
  }

  getById(id: number): Observable<ProdMod> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + id;
    return this.http.get<ProdMod>(newUrl, { headers: headers });
  }

  getByProductId(product_id: number): Observable<ProdMod[]> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/product/' + product_id;
    return this.http.get<ProdMod[]>(newUrl, { headers: headers });
  }

  save(data: ProdMod):Observable<any>{
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    const formData: FormData = new FormData();
    formData.append('image', data.image);
    formData.append('name', data.name);
    formData.append('prodImgNum', String(data.prodImgNum));
    formData.append('productId', String(data.productId));

    return this.http.post<any>(this.url,formData, { headers: headers });
  }

  update(data: ProdMod): Observable<ProdMod> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + data.id;
    return this.http.put<ProdMod>(newUrl,data, { headers: headers });
  }

  delete(id: number): Observable<ProdMod> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + id;
    return this.http.delete<ProdMod>(newUrl, { headers: headers });
  }

  saveMany(dataArr: ProdMod[]): Observable<ProdMod[]> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/many';
    return this.http.post<ProdMod[]>(newUrl, dataArr, { headers: headers });
  }
}
