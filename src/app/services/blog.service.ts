import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../constants';
import { Observable } from 'rxjs';
import { blogItemGet } from '../classes/blogItemGet';
import { blogItemPost } from '../classes/blogItemPost';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private backend_url = Constants.URL_BACKEND;
  private url = this.backend_url + '/post';

  constructor(private http: HttpClient) { }

  getAll(): Observable<blogItemGet[]> {
    return this.http.get<blogItemGet[]>(this.url);
  }

  getById(id: number): Observable<blogItemGet> {
    const newUrl = this.url + '/' + id;
    return this.http.get<blogItemGet>(newUrl);
  }

  getByUserId(id: number): Observable<blogItemGet[]> {
    const newUrl = this.url + '/user/' + id;
    return this.http.get<blogItemGet[]>(newUrl);
  }

  getLast(): Observable<blogItemGet> {
    const newUrl = this.url + '/last';
    return this.http.get<blogItemGet>(newUrl);
  }

  getExcept(id: number): Observable<blogItemGet[]> {
    const newUrl = this.url + '/except/' + id;
    return this.http.get<blogItemGet[]>(newUrl);
  }

  save(post: blogItemPost): Observable<blogItemPost> {

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    const formData: FormData = new FormData();
    formData.append('image', post.image);
    formData.append('title', post.title);
    formData.append('author', post.author);
    formData.append('content', String(post.content));
    formData.append('userId', String(post.userId));

    return this.http.post<blogItemPost>(this.url, formData, { headers: headers });
  }

  update(producto: blogItemPost): Observable<blogItemPost> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + producto.id;
    return this.http.put<blogItemPost>(newUrl, producto, { headers: headers });
  }

  delete(id: number): Observable<blogItemPost> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + id;
    return this.http.delete<blogItemPost>(newUrl, { headers: headers });
  }

}
