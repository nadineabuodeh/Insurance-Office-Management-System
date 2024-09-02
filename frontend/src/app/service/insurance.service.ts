import { Injectable } from '@angular/core';
import { Insurance } from '../model/insurance.model';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class InsuranceService {
  private baseUrl = 'http://localhost:8080/insurances';

  i: Number = 0;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getInsurances(): Observable<Insurance[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Insurance[]>(this.baseUrl, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching insurances:', error);
        return throwError(() => error);
      })
    );
  }

  getInsuranceById(id: number): Observable<Insurance> {
    const headers = this.getAuthHeaders();
    return this.http.get<Insurance>(`${this.baseUrl}/${id}`, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching insurance by ID:', error);
        return throwError(() => error);
      })
    );
  }

  addInsurance(insurance: Insurance): Observable<Insurance> {
    const headers = this.getAuthHeaders();
    return this.http.post<Insurance>(this.baseUrl, insurance, { headers }).pipe(
      tap((response) => console.log('Backend response:', response)), // Ensure this logs the correct response
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      })
    );
  }

  updateInsurance(
    id: number,
    updatedInsurance: Insurance
  ): Observable<Insurance> {
    const headers = this.getAuthHeaders();
    return this.http
      .put<Insurance>(`${this.baseUrl}/${id}`, updatedInsurance, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error updating insurance:', error);
          return throwError(() => error);
        })
      );
  }

  deleteInsurance(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers }).pipe(
      catchError((error) => {
        console.error('Error deleting insurance:', error);
        return throwError(() => error);
      })
    );
  }
}
