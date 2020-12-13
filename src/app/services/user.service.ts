import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../classes/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userInfo: User;
  // private url = '/api/users';
  private url = 'http://18.223.22.157:3000/users';

  constructor(private http: HttpClient) { }

  getAll(): Observable<User[]>{
    return this.http.get<User[]>(this.url);
  }

  getById(id: number): Observable<User> {
    const newUrl = this.url + '/' + id;
    return this.http.get<User>(newUrl);
  }

  getByUsername(username: string): Observable<User> {
    const newUrl = this.url + '/username?username=' + username;
    return this.http.get<User>(newUrl);
  }

  save(data: User):Observable<User>{
    return this.http.post<User>(this.url,data);
  }

  update(data: User): Observable<User> {
    const newUrl = this.url + '/' + data.id;
    return this.http.put<User>(newUrl,data);
  }

  delete(id: number): Observable<User> {
    const newUrl = this.url + '/' + id;
    return this.http.delete<User>(newUrl);
  }

  login(user: string, pass: string): Observable<any> {
    const newUrl = this.url + '/login';
    var userData = {
      username: user,
      password: pass
    }
    return this.http.post<any>(newUrl, userData);
  }

}
