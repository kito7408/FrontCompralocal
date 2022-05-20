import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeliveryZone } from '../classes/deliveryZone'
import { Constants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class DeliveryZoneService {

  private backend_url = Constants.URL_BACKEND;
  private url = this.backend_url + '/deliveryzone';

  constructor(private http: HttpClient) { }

  getAll(): Observable<DeliveryZone[]>{
    return this.http.get<DeliveryZone[]>(this.url);
  }

  getById(id: number): Observable<DeliveryZone> {
    const newUrl = this.url + '/' + id;
    return this.http.get<DeliveryZone>(newUrl);
  }

  save(data: DeliveryZone):Observable<DeliveryZone>{
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.post<DeliveryZone>(this.url,data, { headers: headers });
  }

  update(data: DeliveryZone): Observable<DeliveryZone> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + data.id;
    return this.http.put<DeliveryZone>(newUrl,data, { headers: headers });
  }

  updateFromProd(data: DeliveryZone[], prodId: number): Observable<DeliveryZone> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/updateFromProd/' + prodId;
    return this.http.put<DeliveryZone>(newUrl,data, { headers: headers });
  }

  delete(id: number): Observable<DeliveryZone> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + id;
    return this.http.delete<DeliveryZone>(newUrl, { headers: headers });
  }

  saveMany(dataArr: DeliveryZone[]): Observable<DeliveryZone[]> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/many';
    return this.http.post<DeliveryZone[]>(newUrl, dataArr, { headers: headers });
  }
}
