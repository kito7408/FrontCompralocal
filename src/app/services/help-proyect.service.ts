import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HelpProyect } from '../classes/helpProyect';
import { Constants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class HelpProyectService {

  private backend_url = Constants.URL_BACKEND;
  private url = this.backend_url + '/helpproy';

  constructor(private http: HttpClient) { }

  getAll(): Observable<HelpProyect[]>{
    return this.http.get<HelpProyect[]>(this.url);
  }

  getById(id: number): Observable<HelpProyect> {
    const newUrl = this.url + '/' + id;
    return this.http.get<HelpProyect>(newUrl);
  }

  save(data: HelpProyect):Observable<HelpProyect>{
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.post<HelpProyect>(this.url,data, { headers: headers });
  }

  update(data: HelpProyect): Observable<HelpProyect> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + data.id;
    return this.http.put<HelpProyect>(newUrl,data, { headers: headers });
  }

  delete(id: number): Observable<HelpProyect> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + id;
    return this.http.delete<HelpProyect>(newUrl, { headers: headers });
  }

}
