import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Direction } from '../classes/direction';
import { Constants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class DirectionService {

  private backend_url = Constants.URL_BACKEND;
  private url = this.backend_url + '/direction';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Direction[]>{
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.get<Direction[]>(this.url, { headers: headers });
  }

  getById(id: number): Observable<Direction> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + id;
    return this.http.get<Direction>(newUrl, { headers: headers });
  }

  getByUserId(user_id: number): Observable<Direction[]> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/user/' + user_id;
    return this.http.get<Direction[]>(newUrl, { headers: headers });
  }

  save(data: Direction):Observable<any>{
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.post<any>(this.url,data, { headers: headers });
  }

  update(data: Direction): Observable<Direction> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + data.id;
    return this.http.put<Direction>(newUrl,data, { headers: headers });
  }

  delete(id: number): Observable<Direction> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + id;
    return this.http.delete<Direction>(newUrl, { headers: headers });
  }

}
