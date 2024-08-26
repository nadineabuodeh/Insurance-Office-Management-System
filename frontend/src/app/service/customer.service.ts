import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { AuthService } from './auth.service';
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
  providedIn: 'root'
})
export class CustomerService {
  private baseUrl = 'http://localhost:8080/users';
  private customersChanged = new Subject<void>(); // subject to notify changes

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
  // ==================================================================



  getCustomers(): Observable<Customer[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Customer[]>(this.baseUrl, { headers })
      .pipe(
        map(customers => customers.filter(customer => customer.role === 'ROLE_CUSTOMER')), // Get Only Customers..
        catchError(error => {
          console.error('Error occurred:', error);
          return throwError(() => error);
        })
      );
  }


  getCustomerById(id: number): Observable<Customer> {
    const headers = this.getAuthHeaders();
    return this.http.get<Customer>(`${this.baseUrl}/${id}`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error fetching customer by ID:', error);
          return throwError(() => error);
        })
      );
  }
  // ==================================================================

  addCustomer(customer: Customer): Observable<Customer> {//pass
    customer.role = 'ROLE_CUSTOMER'; //// Set user role as a customer..


    const headers = this.getAuthHeaders();
    return this.http.post<Customer>(this.baseUrl, customer, { headers })
      .pipe(
        tap(response => console.log('Backend response:', response)),
        tap(() => this.customersChanged.next()),
        catchError(error => {
          console.error('Error occurred:', error);
          return throwError(() => error);
        })
      );
  }
  // ==================================================================

  deleteCustomer(id: number): Observable<void> {//pass
    const headers = this.getAuthHeaders();
    console.log("delete called")

    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers })
      .pipe(
        tap(() => this.customersChanged.next()),
        catchError(error => {
          console.error('Error deleting:', error);
          return throwError(() => error);
        })
      );
  }
  // ==================================================================


  updateCustomer(id: number, updatedCustomer: Customer): Observable<Customer> {//pass

    const headers = this.getAuthHeaders();


    updatedCustomer.role = 'ROLE_CUSTOMER';// Specify the role as a customer

    return this.http.put<Customer>(`${this.baseUrl}/${id}`, updatedCustomer, { headers })
      .pipe(
        tap(() => this.customersChanged.next()),
        catchError(this.handleError<Customer>('updateCustomer'))
      );
  }
  // ==================================================================
  customersChanged$ = this.customersChanged.asObservable();

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

}