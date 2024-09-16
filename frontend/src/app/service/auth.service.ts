import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { LoginRequest } from '../model/login-request';
import { JwtResponse } from '../model/jwt-response';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';
  private adminId: string | null = null

  constructor(private http: HttpClient, private router: Router) { }

  login(loginRequest: LoginRequest): Observable<JwtResponse> {
    return this.http
      .post<JwtResponse>(`${this.baseUrl}/signin`, loginRequest)
      .pipe(
        tap((response) => {
          console.log('Full Backend Response:', response);
          if (response && response.accessToken) {
            console.log('JWT Token:', response.accessToken);
            const role = response.roles[0];
            this.saveToken(response.accessToken, role);
            this.adminId = response.id?.toString() || null; // Save admin ID
            if (this.adminId) {
              localStorage.setItem('adminId', this.adminId); // Also store adminId in localStorage
            }
            console.log('Admin ID:', this.adminId);
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
    localStorage.removeItem('adminId');

    const tokenAfterLogout = localStorage.getItem('authToken');
    console.log('Token after logout:', tokenAfterLogout);
    this.adminId = null;

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
    localStorage.removeItem('adminId');
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

  getAdminId(): string | null {
    return this.adminId || localStorage.getItem('adminId'); 
  }

}
