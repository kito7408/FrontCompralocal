import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductPost } from '../classes/productPost';   //solo tiene los ids de categoria y supplier
import { ProductGet } from '../classes/productGet';     //tiene los objetos categoria y supplier

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  filter: string = '';
  filterType: number = 0;

  // private url = '/api/products';
  private url = 'http://18.223.22.157:3000/products';

  constructor(private http: HttpClient) { }

  getAll(): Observable<ProductGet[]>{
    return this.http.get<ProductGet[]>(this.url);
  }

  getById(id: number): Observable<ProductGet> {
    const newUrl = this.url + '/' + id;
    return this.http.get<ProductGet>(newUrl);
  }

  getByCategoriaId(id: number): Observable<ProductGet[]> {
    const newUrl = this.url + '/category/' + id;
    return this.http.get<ProductGet[]>(newUrl);
  }

  getBySubCategoriaId(id: number): Observable<ProductGet[]> {
    const newUrl = this.url + '/subcategory/' + id;
    return this.http.get<ProductGet[]>(newUrl);
  }

  getBySupplierId(id: number): Observable<ProductGet[]> {
    const newUrl = this.url + '/supplier/' + id;
    return this.http.get<ProductGet[]>(newUrl);
  }

  getBySearch(searchText: string): Observable<ProductGet[]> {
    const newUrl = this.url + '/search?name=' + searchText;
    return this.http.get<ProductGet[]>(newUrl);
  }

  save(producto: ProductPost):Observable<ProductPost>{

    const formData: FormData = new FormData();
    formData.append('image', producto.image);
    formData.append('name', producto.name);
    formData.append('categoryId', String(producto.categoryId));
    formData.append('subcategoryId', String(producto.subcategoryId));
    formData.append('price', String(producto.price));
    formData.append('description', String(producto.description));
    formData.append('isTrent', String(producto.isTrent));
    formData.append('location', producto.location);
    formData.append('numSellOnWeek', String(producto.numSellOnWeek));
    formData.append('supplierId', String(producto.supplierId));

    return this.http.post<ProductPost>(this.url, formData);
  }

  update(producto: ProductPost): Observable<ProductPost> {
    const newUrl = this.url + '/' + producto.id;
    return this.http.put<ProductPost>(newUrl,producto);
  }

  delete(id: number): Observable<ProductPost> {
    const newUrl = this.url + '/' + id;
    return this.http.delete<ProductPost>(newUrl);
  }

  updateSales(prodInfo: any): Observable<any> {
    const newUrl = this.url + '/sales';
    return this.http.put<any>(newUrl, {data: prodInfo});
  }
}
