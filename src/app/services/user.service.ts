import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../classes/user';
import { Constants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userInfo: User;
  private backend_url = Constants.URL_BACKEND;
  private url = this.backend_url + '/users';

  constructor(private http: HttpClient) { }

  getAll(): Observable<User[]>{
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.get<User[]>(this.url, { headers: headers });
  }

  getById(id: number): Observable<User> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + id;
    return this.http.get<User>(newUrl, { headers: headers });
  }

  getByEmail(email: string): Observable<User> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/email?email=' + email;
    return this.http.get<User>(newUrl, { headers: headers });
  }

  save(data: User):Observable<User>{
    return this.http.post<User>(this.url,data);
  }

  update(data: User): Observable<User> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + data.id;
    return this.http.put<User>(newUrl,data, { headers: headers });
  }

  delete(id: number): Observable<User> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    const newUrl = this.url + '/' + id;
    return this.http.delete<User>(newUrl, { headers: headers });
  }

  login(user: string, pass: string): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    const newUrl = this.url + '/login';
    var userData = {
      email: user,
      password: pass
    }
    return this.http.post<any>(newUrl, userData, { headers: headers });
  }

  loginSocialMedia(email: string): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    const newUrl = this.url + '/login/socialmedia';
    return this.http.post<any>(newUrl, {email: email}, { headers: headers });
  }
}
