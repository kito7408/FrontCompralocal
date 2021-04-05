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

  getByName(name: string): Observable<Supplier> {
    const newUrl = this.url + '/name/' + name;
    return this.http.get<Supplier>(newUrl);
  }

  getByCoded(encoded: any): Observable<Supplier> {
    const newUrl = this.url + '/coded';
    return this.http.put<Supplier>(newUrl, encoded);
  }

  save(data: Supplier):Observable<any>{
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    const formData: FormData = new FormData();
    formData.append('image', data.image);
    formData.append('image', data.image_person);
    formData.append('name', data.name);
    formData.append('business_name', data.business_name);
    formData.append('bank', data.bank);
    formData.append('account_number', data.account_number);
    formData.append('cci_account_number', data.cci_account_number);
    formData.append('email', data.email);
    formData.append('contact_person', data.contact_person);
    formData.append('description', data.description);
    formData.append('dni_contact', data.dni_contact);
    formData.append('departamento', data.departamento);
    formData.append('provincia', data.provincia);
    formData.append('distrito', data.distrito);
    formData.append('direccion', data.direccion);
    formData.append('phone_contact', data.phone_contact);
    formData.append('ruc', data.ruc);
    formData.append('available', String(data.available));

    return this.http.post<any>(this.url,formData, { headers: headers });
  }

  update(data: any): Observable<Supplier> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    const formData: FormData = new FormData();
    formData.append('id', data.id);
    formData.append('image', data.image);
    formData.append('image', data.image_person);
    formData.append('name', data.name);
    formData.append('business_name', data.business_name);
    formData.append('bank', data.bank);
    formData.append('account_number', data.account_number);
    formData.append('cci_account_number', data.cci_account_number);
    formData.append('email', data.email);
    formData.append('contact_person', data.contact_person);
    formData.append('description', data.description);
    formData.append('dni_contact', data.dni_contact);
    formData.append('departamento', data.departamento);
    formData.append('provincia', data.provincia);
    formData.append('distrito', data.distrito);
    formData.append('direccion', data.direccion);
    formData.append('phone_contact', data.phone_contact);
    formData.append('ruc', data.ruc);
    formData.append('available', String(data.available));
    formData.append('changeImg1', String(data.changeImg1));
    formData.append('changeImg2', String(data.changeImg2));

    const newUrl = this.url + '/' + data.id;

    return this.http.put<Supplier>(newUrl,formData, { headers: headers });
  }

  delete(id: number): Observable<Supplier> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + id;
    return this.http.delete<Supplier>(newUrl, { headers: headers });
  }

}
