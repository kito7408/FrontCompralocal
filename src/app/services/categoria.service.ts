import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryPost } from '../classes/categoryPost';
import { CategoryGet } from '../classes/categoryGet';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private url = '/api/category';

  constructor(private http: HttpClient) { }

  getAll(): Observable<CategoryGet[]>{
    return this.http.get<CategoryGet[]>(this.url);
  }

  getById(id: number): Observable<CategoryGet> {
    const newUrl = this.url + '/' + id;
    return this.http.get<CategoryGet>(newUrl);
  }

  save(data: CategoryPost):Observable<CategoryPost>{
    return this.http.post<CategoryPost>(this.url,data);
  }

  update(data: CategoryPost): Observable<CategoryPost> {
    const newUrl = this.url + '/' + data.id;
    return this.http.put<CategoryPost>(newUrl,data);
  }

  delete(id: number): Observable<CategoryPost> {
    const newUrl = this.url + '/' + id;
    return this.http.delete<CategoryPost>(newUrl);
  }

}
