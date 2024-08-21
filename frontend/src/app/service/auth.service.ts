import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { LoginRequest } from '../model/login-request';
import { JwtResponse } from '../model/jwt-response';
import { catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient , private router: Router) { }

  login(loginRequest: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.baseUrl}/signin`, loginRequest)
      .pipe(
        tap(response => {
          console.log('Full Backend Response:', response);
          if (response && response.accessToken) {
            console.log('JWT Token:', response.accessToken);
            const role = response.roles[0];
            this.saveToken(response.accessToken, role);
          } else {
            console.warn('Token is undefined or null');
          }
        }),
        catchError(this.handleError)
      );
  }  

  saveToken(token: string, role: string): void {
    const now = new Date();
    const expirationTime = now.getTime() + 3600 * 1000;

    localStorage.setItem('authToken', token);
    localStorage.setItem('tokenExpiration', expirationTime.toString());
    localStorage.setItem('userRole', role);
    console.log('Token saved:', token);
  }

  logout(): void {
    const tokenBeforeLogout = localStorage.getItem('authToken');
    console.log('Token before logout:', tokenBeforeLogout);
  
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('userRole');
  
    const tokenAfterLogout = localStorage.getItem('authToken');
    console.log('Token after logout:', tokenAfterLogout);
  
    this.router.navigate(['/login']);
  }  
  
  isTokenExpired(): boolean {
    const expiration = localStorage.getItem('tokenExpiration');
    if (expiration) {
      const now = new Date().getTime();
      return now > Number(expiration);
    }
    return true;
  }

  clearToken(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('userRole');
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }
  
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.status === 401) {
      errorMessage = 'Invalid username or password!';
    } else {
      errorMessage = 'An unexpected error occurred!';
    }
    return throwError(() => new Error(errorMessage));
  }
}