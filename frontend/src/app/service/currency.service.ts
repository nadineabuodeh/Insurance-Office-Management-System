import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private baseUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) { }

  getAdminProfile(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/profile`, { headers });
  }

  setCurrency(currency: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/setCurrency`, { currency }, { headers });
  }

  getAdminCurrency(): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}/currency`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
  }
}
