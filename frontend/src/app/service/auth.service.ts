import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { LoginRequest } from '../model/login-request';
import { JwtResponse } from '../model/jwt-response';
// import { CookieService } from 'ngx-cookie-service';
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
          console.log('Backend response:', response);
          if (response.token) { // Check if token exists
            console.log('JWT Token:', response.token); // Print the JWT token
          }
        }),
        catchError(this.handleError)
      );
  }
  
  
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('userRole');
    this.router.navigate(['/login']);
  }

  saveToken(jwtResponse: JwtResponse): void {
    const now = new Date();
    const expirationTime = now.getTime() + 3600 * 1000;

    localStorage.setItem('authToken', jwtResponse.token);
    localStorage.setItem('tokenExpiration', expirationTime.toString());
    localStorage.setItem('userRole', jwtResponse.roles[0]);
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