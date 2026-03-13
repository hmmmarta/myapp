import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';

export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  signUp(userData: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, userData);
  }

  logIn(email: string, password: string): Observable<User> {
    const params = new HttpParams()
      .set('email', email)
      .set('password', password);
    return this.http.get<User[]>(this.apiUrl, { params }).pipe(
      map(users => {
        if (users.length > 0) {
          return users[0];
        } else {
          throw new Error('Invalid email or password');
        }
      })
    );
  }
  changePassword(email: string, newPassword: string): Observable<User> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}`).pipe(
      switchMap(users => {
        if (users.length > 0) {
          const user = users[0];

          return this.http.patch<User>(`${this.apiUrl}/${user.id}`, { 
            password: newPassword 
          });
        } else {
          throw new Error('No user with this email');
        }
      })
    );
  }
}