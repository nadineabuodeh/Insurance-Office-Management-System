import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { LoginRequest } from '../model/login-request';
import { JwtResponse } from '../model/jwt-response';
import { CookieService } from 'ngx-cookie-service';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth'; // Adjust the URL to match your backend

  constructor(private http: HttpClient) { }

  login(loginRequest: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.baseUrl}/signin`, loginRequest)
      .pipe(
        catchError(this.handleError)
      );
  }

  saveToken(jwtResponse: JwtResponse): void {
    const now = new Date();
    const expirationTime = now.getTime() + 3600 * 1000; // 1 hour

    localStorage.setItem('authToken', jwtResponse.token);
    localStorage.setItem('tokenExpiration', expirationTime.toString());
    localStorage.setItem('userRole', jwtResponse.roles[0]); // Assuming one role per user
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