import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryPost } from '../classes/categoryPost';
import { CategoryGet } from '../classes/categoryGet';
import { Constants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private backend_url = Constants.URL_BACKEND;
  private url = this.backend_url + '/category';

  constructor(private http: HttpClient) { }

  getAll(): Observable<CategoryGet[]>{
    return this.http.get<CategoryGet[]>(this.url);
  }

  getById(id: number): Observable<CategoryGet> {
    const newUrl = this.url + '/' + id;
    return this.http.get<CategoryGet>(newUrl);
  }

  save(data: CategoryPost):Observable<CategoryPost>{
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.post<CategoryPost>(this.url,data, { headers: headers });
  }

  update(data: CategoryPost): Observable<CategoryPost> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + data.id;
    return this.http.put<CategoryPost>(newUrl,data, { headers: headers });
  }

  delete(id: number): Observable<CategoryPost> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + id;
    return this.http.delete<CategoryPost>(newUrl, { headers: headers });
  }

}
