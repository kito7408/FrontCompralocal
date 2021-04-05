import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InfoContacto } from '../classes/infoContacto';
import { Constants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class InfoContactoService {

  private backend_url = Constants.URL_BACKEND;
  private url = this.backend_url + '/infocontacto';

  constructor(private http: HttpClient) { }

  getAll(): Observable<InfoContacto[]>{
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.get<InfoContacto[]>(this.url, { headers: headers });
  }

  getById(id: number): Observable<InfoContacto> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + id;
    return this.http.get<InfoContacto>(newUrl, { headers: headers });
  }

  save(data: InfoContacto):Observable<any>{
    return this.http.post<any>(this.url,data);
  }

  update(data: InfoContacto): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + data.id;
    return this.http.put<any>(newUrl,data, { headers: headers });
  }

  delete(id: number): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + id;
    return this.http.delete<any>(newUrl, { headers: headers });
  }

}
