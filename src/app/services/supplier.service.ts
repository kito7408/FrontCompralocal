import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Supplier } from '../classes/supplier';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  // private url = '/api/suppliers';
  private url = 'http://18.223.22.157:3000/suppliers';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Supplier[]>{
    return this.http.get<Supplier[]>(this.url);
  }

  getById(id: number): Observable<Supplier> {
    const newUrl = this.url + '/' + id;
    return this.http.get<Supplier>(newUrl);
  }

  save(data: Supplier):Observable<Supplier>{
    return this.http.post<Supplier>(this.url,data);
  }

  update(data: Supplier): Observable<Supplier> {
    const newUrl = this.url + '/' + data.id;
    return this.http.put<Supplier>(newUrl,data);
  }

  delete(id: number): Observable<Supplier> {
    const newUrl = this.url + '/' + id;
    return this.http.delete<Supplier>(newUrl);
  }

}
