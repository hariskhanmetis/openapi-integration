import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiURL = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {
    return this.http.get<any[]>(this.apiURL);
  }

  addUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiURL, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiURL}/${id}`);
  }

  updateUser(id: any ,user: any): Observable<any> {
    return this.http.put(`${this.apiURL}/${id}`, user);
  }
}
