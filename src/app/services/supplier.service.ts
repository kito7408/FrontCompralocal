import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Supplier } from '../classes/supplier';
import { Constants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private backend_url = Constants.URL_BACKEND;
  private url = this.backend_url + '/suppliers';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Supplier[]>{
    return this.http.get<Supplier[]>(this.url);
  }

  getById(id: number): Observable<Supplier> {
    const newUrl = this.url + '/' + id;
    return this.http.get<Supplier>(newUrl);
  }

  save(data: Supplier):Observable<Supplier>{

    const formData: FormData = new FormData();
    formData.append('image', data.image);
    formData.append('name', data.name);
    formData.append('bank', data.bank);
    formData.append('account_number', data.account_number);
    formData.append('email', data.email);
    formData.append('contact_person', data.contact_person);

    return this.http.post<Supplier>(this.url,formData);
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
