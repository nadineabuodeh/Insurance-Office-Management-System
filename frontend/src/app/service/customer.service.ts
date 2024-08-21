import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Import AuthService to get the token
import { catchError, tap, throwError } from 'rxjs';

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: Date;
  username: string;
  email: string;
  phoneNumber: string;
  idNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private baseUrl = 'http://localhost:8080/users'; 

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    console.log("TOKEN->"+token)
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }


  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.baseUrl); 
  }

  addCustomer(customer: Customer): Observable<Customer> {
    console.log('Adding customer:', customer);
    return this.http.post<Customer>(this.baseUrl, customer)
      .pipe(
        tap(response => console.log('Backend response:', response)),
        catchError(error => {
          console.error('Error occurred:', error);
          return throwError(() => error);
        })
      );
  }
  
  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`); 
  }

  updateCustomer(id: number, updatedCustomer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.baseUrl}/${id}`, updatedCustomer); 
  }
}

