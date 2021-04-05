import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageReviewGet, PageReviewPost } from '../classes/pagereview';
import { Constants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class PagereviewService {

  
  private backend_url = Constants.URL_BACKEND;
  private url = this.backend_url + '/pagereview';

  constructor(private http: HttpClient) { }

  getAll(): Observable<PageReviewGet[]>{
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.get<PageReviewGet[]>(this.url, { headers: headers });
  }

  getById(id: number): Observable<PageReviewGet> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + id;
    return this.http.get<PageReviewGet>(newUrl, { headers: headers });
  }

  getByUserId(id: number): Observable<PageReviewGet> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/user/' + id;
    return this.http.get<PageReviewGet>(newUrl, { headers: headers });
  }

  save(data: PageReviewPost):Observable<PageReviewPost>{
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.post<PageReviewPost>(this.url,data, { headers: headers });
  }

  update(data: PageReviewPost): Observable<PageReviewPost> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + data.id;
    return this.http.put<PageReviewPost>(newUrl,data, { headers: headers });
  }

  delete(id: number): Observable<PageReviewPost> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + id;
    return this.http.delete<PageReviewPost>(newUrl, { headers: headers });
  }

}
