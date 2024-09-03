import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { AuthService } from '../auth.service';
import { catchError, map, tap, throwError } from 'rxjs';

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: Date;
  username: string;
  email: string;
  phoneNumber: String;
  idNumber: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private baseUrl = 'http://localhost:8080/users';
  private customersChanged = new Subject<void>();

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }


  getCustomers(): Observable<Customer[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Customer[]>(this.baseUrl, { headers }).pipe(
      map((customers) =>
        customers.filter((customer) => customer.role === 'ROLE_CUSTOMER')
      ),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  getCustomerById(id: number): Observable<Customer> {
    const headers = this.getAuthHeaders();
    return this.http.get<Customer>(`${this.baseUrl}/${id}`, { headers }).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  getCustomerInfo(): Observable<Customer> {
    const headers = this.getAuthHeaders();
    return this.http.get<Customer>(`${this.baseUrl}/me`, { headers }).pipe(
      tap((response) => console.log('Fetched customer info:', response)),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  addCustomer(customer: Customer): Observable<Customer> {
    customer.role = 'ROLE_CUSTOMER'; 

    const headers = this.getAuthHeaders();
    return this.http.post<Customer>(this.baseUrl, customer, { headers }).pipe(
      tap((response) => console.log('Backend response:', response)),
      tap(() => this.customersChanged.next()),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  deleteCustomer(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers }).pipe(
      tap(() => this.customersChanged.next()),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

 updateCustomer(id: number, updatedCustomer: Customer): Observable<Customer> {
    const headers = this.getAuthHeaders();
    updatedCustomer.role = 'ROLE_CUSTOMER';// Specify the role as customer
    return this.http.put<Customer>(`${this.baseUrl}/${id}`, updatedCustomer, { headers })
      .pipe(
        tap(() => this.customersChanged.next()),
        catchError(this.handleError<Customer>('updateCustomer'))
      );
  }

  customersChanged$ = this.customersChanged.asObservable();

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return of(result as T);
    };
  }

  
}
