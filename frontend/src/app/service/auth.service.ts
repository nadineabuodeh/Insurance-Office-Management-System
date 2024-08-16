import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { LoginRequest } from '../model/login-request';
import { JwtResponse } from '../model/jwt-response';
import { CookieService } from 'ngx-cookie-service';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  login(loginRequest: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.baseUrl}/signin`, loginRequest)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.status === 401) {
      errorMessage = 'Invalid username or password!';
    } else {
      errorMessage = 'An unexpected error occurred! Please try again later.';
    }
    return throwError(() => new Error(errorMessage));
  }
  
  saveToken(token: string): void {
    const now = new Date();
    const expirationTime = new Date(now.getTime() + 3600 * 1000);
    this.cookieService.set('authToken', token, expirationTime);
  }

  isTokenExpired(): boolean {
    const token = this.cookieService.get('authToken');
    return !token;
  }

  clearToken(): void {
    this.cookieService.delete('authToken');
  }
}
