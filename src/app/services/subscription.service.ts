import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../constants';
import { Subscription } from '../classes/subscription';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  
  private backend_url = Constants.URL_BACKEND;
  private url = this.backend_url + '/subscription';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Subscription[]>{
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.get<Subscription[]>(this.url, { headers: headers });
  }

  getById(id: number): Observable<Subscription> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + id;
    return this.http.get<Subscription>(newUrl, { headers: headers });
  }

  save(data: Subscription):Observable<Subscription>{
    return this.http.post<Subscription>(this.url,data);
  }

  update(data: Subscription): Observable<Subscription> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + data.id;
    return this.http.put<Subscription>(newUrl,data, { headers: headers });
  }

  delete(id: number): Observable<Subscription> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + id;
    return this.http.delete<Subscription>(newUrl, { headers: headers });
  }

}
