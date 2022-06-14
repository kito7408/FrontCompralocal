import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductPost } from '../classes/productPost';   //solo tiene los ids de categoria y supplier
import { ProductGet } from '../classes/productGet';     //tiene los objetos categoria y supplier
import { Constants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  filter: string = '';
  filterType: number = 0;

  private backend_url = Constants.URL_BACKEND;
  private url = this.backend_url + '/products';

  constructor(private http: HttpClient) { }

  getAll(): Observable<ProductGet[]> {
    return this.http.get<ProductGet[]>(this.url);
  }

  getSortedByBuyed(): Observable<ProductGet[]> {
    const newUrl = this.url + '/mostbuyed';
    return this.http.get<ProductGet[]>(newUrl);
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

  save(producto: ProductPost): Observable<ProductPost> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    const formData: FormData = new FormData();
    formData.append('image', producto.image1);
    formData.append('image', producto.image2);
    formData.append('image', producto.image3);
    formData.append('image', producto.image4);
    formData.append('image', producto.image5);
    formData.append('name', producto.name);
    formData.append('categoryId', String(producto.categoryId));
    formData.append('subcategoryId', String(producto.subcategoryId));
    formData.append('price', String(producto.price));
    formData.append('description', String(producto.description));
    formData.append('isTrent', String(producto.isTrent));
    formData.append('numSellOnWeek', String(producto.numSellOnWeek));
    formData.append('supplierId', String(producto.supplierId));
    formData.append('isOffer', String(producto.isOffer));
    formData.append('priceOffer', String(producto.priceOffer));
    formData.append('unit', String(producto.unit));
    formData.append('toProv', String(producto.toProv));
    formData.append('daysToSend', producto.daysToSend);
    formData.append('numDaysToSend', String(producto.numDaysToSend));
    formData.append('numDaysToSend2', String(producto.numDaysToSend2));

    return this.http.post<ProductPost>(this.url, formData, { headers: headers });
  }

  update(producto: ProductPost, newImgs: boolean[]): Observable<ProductPost> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    const formData: FormData = new FormData();
    formData.append('id', String(producto.id));
    formData.append('image', producto.image1);
    formData.append('image', producto.image2);
    formData.append('image', producto.image3);
    formData.append('image', producto.image4);
    formData.append('image', producto.image5);
    formData.append('name', producto.name);
    formData.append('categoryId', String(producto.categoryId));
    formData.append('price', String(producto.price));
    formData.append('description', String(producto.description));
    formData.append('isTrent', String(producto.isTrent));
    formData.append('numSellOnWeek', String(producto.numSellOnWeek));
    formData.append('supplierId', String(producto.supplierId));
    formData.append('isOffer', String(producto.isOffer));
    formData.append('priceOffer', String(producto.priceOffer));
    formData.append('unit', String(producto.unit));
    formData.append('toProv', String(producto.toProv));
    formData.append('daysToSend', producto.daysToSend);
    formData.append('numDaysToSend', String(producto.numDaysToSend));
    formData.append('numDaysToSend2', String(producto.numDaysToSend2));

    formData.append('changeImg1', String(newImgs[0]));
    formData.append('changeImg2', String(newImgs[1]));
    formData.append('changeImg3', String(newImgs[2]));
    formData.append('changeImg4', String(newImgs[3]));
    formData.append('changeImg5', String(newImgs[4]));

    const newUrl = this.url + '/' + producto.id;
    return this.http.put<ProductPost>(newUrl, formData, { headers: headers });
  }

  delete(id: number): Observable<ProductPost> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + id;
    return this.http.delete<ProductPost>(newUrl, { headers: headers });
  }

  updateSales(prodInfo: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/sales';
    return this.http.put<any>(newUrl, { data: prodInfo }, { headers: headers });
  }
}
