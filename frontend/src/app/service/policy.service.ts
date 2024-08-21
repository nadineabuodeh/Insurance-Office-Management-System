import { Injectable } from '@angular/core';

export interface Policy {
  id: number;
  startDate: string;
  endDate: string;
  totalAmount: number;
  coverageDetails: string;
  userId: number;
  insuranceId: number;
}

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  private policies: Policy[] = [];

  addPolicy(policy: Policy): void {
    this.policies.push(policy);
    this.saveToLocalStorage();
  }

  updatePolicy(id: number, updatedPolicy: Policy): void {
    const index = this.policies.findIndex(p => p.id === id);
    if (index !== -1) {
      this.policies[index] = updatedPolicy;
      this.saveToLocalStorage();
    }
  }

  getPolicies(): Policy[] {
    return this.policies;
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('policies', JSON.stringify(this.policies));
  }

  deletePolicy(id: number): void {
    this.policies = this.policies.filter(p => p.id !== id);
    this.saveToLocalStorage();
  }
}
