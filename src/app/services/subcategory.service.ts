import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subcategory } from '../classes/subCategory';

@Injectable({
  providedIn: 'root'
})
export class SubcategoryService {

  // private url = '/api/subcategory';
  private url = 'http://18.223.22.157:3000/subcategory';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Subcategory[]>{
    return this.http.get<Subcategory[]>(this.url);
  }

  getById(id: number): Observable<Subcategory> {
    const newUrl = this.url + '/' + id;
    return this.http.get<Subcategory>(newUrl);
  }

  getByCategoryId(id: number): Observable<Subcategory[]> {
    const newUrl = this.url + '/category/' + id;
    return this.http.get<Subcategory[]>(newUrl);
  }

  save(data: Subcategory):Observable<Subcategory>{
    return this.http.post<Subcategory>(this.url,data);
  }

  update(data: Subcategory): Observable<Subcategory> {
    const newUrl = this.url + '/' + data.id;
    return this.http.put<Subcategory>(newUrl,data);
  }

  delete(id: number): Observable<Subcategory> {
    const newUrl = this.url + '/' + id;
    return this.http.delete<Subcategory>(newUrl);
  }

}
