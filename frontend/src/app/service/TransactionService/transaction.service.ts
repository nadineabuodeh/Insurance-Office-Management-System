import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface Transaction {
  id: number;
  startDate: string;
  amount: number;
  endDate: string;
  transactionType: string;
  createdAt?: string;
  updatedAt?: string;
  userId: number;
  policyId: number;
}

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private baseUrl = 'http://localhost:8080/transactions';
  private transactionsChanged = new Subject<void>();

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getAllTransactions(): Observable<Transaction[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Transaction[]>(this.baseUrl, { headers }).pipe(
      tap((transactions) => {
        const transactionTypes = transactions.map(
          (transaction) => transaction.transactionType
        );
        console.log('Fetched Transaction Types:', transactionTypes);
      }),
      catchError(this.handleError<Transaction[]>('getAllTransactions', []))
    );
  }

  getTransactionById(id: number): Observable<Transaction> {
    const headers = this.getAuthHeaders();
    return this.http
      .get<Transaction>(`${this.baseUrl}/${id}`, { headers })
      .pipe(
        catchError(this.handleError<Transaction>(`getTransactionById id=${id}`))
      );
  }

  getTransactionsForCustomer(): Observable<Transaction[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Transaction[]>(`${this.baseUrl}/my-transactions`, { headers }).pipe(
      catchError(this.handleError<Transaction[]>('getTransactionsForCustomer', []))
    );
  }

  getDebtTransactions(): Observable<Transaction[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Transaction[]>(`${this.baseUrl}/my-debts`, { headers }).pipe(
      tap((transactions) => {
        console.log('Fetched Debt Transactions:', transactions);
      }),
      catchError(this.handleError<Transaction[]>('getDebtTransactions', []))
    );
  }

  getTransactionsByCustomerId(customerId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(
      `${this.baseUrl}/customer/${customerId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  createTransaction(transaction: Transaction): Observable<Transaction> {
    transaction.createdAt = new Date().toISOString(); // Set [created at] to the current date
    const headers = this.getAuthHeaders();
    return this.http
      .post<Transaction>(this.baseUrl, transaction, { headers })
      .pipe(
        tap(() => this.transactionsChanged.next()),
        catchError(this.handleError<Transaction>('createTransaction'))
      );
  }

  updateTransaction(
    id: number,
    transaction: Transaction
  ): Observable<Transaction> {
    const headers = this.getAuthHeaders();
    if (!id) {
      console.error('Transaction ID is undefined');
      return throwError('Transaction ID is undefined');
    }
    return this.http
      .put<Transaction>(`${this.baseUrl}/${id}`, transaction, { headers })
      .pipe(
        tap(() => this.transactionsChanged.next()),
        catchError(this.handleError<Transaction>('updateTransaction'))
      );
  }

  deleteTransaction(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers }).pipe(
      tap(() => this.transactionsChanged.next()),
      catchError(this.handleError<void>('deleteTransaction'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  transactionsChanged$ = this.transactionsChanged.asObservable();
}
