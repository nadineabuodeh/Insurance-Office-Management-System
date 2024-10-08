import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Policy } from '../model/policy.model';

@Injectable({
  providedIn: 'root',
})
export class PolicyService {
  private apiUrl = 'http://localhost:8080/policies';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getAllPolicies(): Observable<Policy[]> {
    return this.http.get<Policy[]>(this.apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  getPoliciesByCustomerId(customerId: number): Observable<Policy[]> {
    return this.http.get<Policy[]>(`${this.apiUrl}/customer/${customerId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getPoliciesForCustomer(): Observable<Policy[]> {
    return this.http.get<Policy[]>(`${this.apiUrl}/my-policies`, {
      headers: this.getAuthHeaders(),
    });
  }

  getPolicyById(id: number): Observable<Policy> {
    return this.http.get<Policy>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }


  createPolicy(policy: Policy, numberOfPayments?: number): Observable<Policy> {
    let params = new HttpParams();
    if (numberOfPayments !== undefined) {
      params = params.set('numberOfPayments', numberOfPayments.toString());
    }

    return this.http.post<Policy>(this.apiUrl, policy, {
      headers: this.getAuthHeaders(),
      params: params
    });
  }

  updatePolicy(id: number, policy: Policy): Observable<Policy> {
    return this.http.put<Policy>(`${this.apiUrl}/${id}`, policy, {
      headers: this.getAuthHeaders(),
    });
  }

  deletePolicy(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getUserIdByPolicyId(policyId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/user/${policyId}`, { headers: this.getAuthHeaders() });
  }



}
