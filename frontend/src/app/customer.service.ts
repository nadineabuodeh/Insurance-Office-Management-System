import { Injectable } from '@angular/core';

export interface Customer {
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
  private customers: Customer[] = [];

  private storageKey = 'customers';


  constructor() {
    this.customers = this.getCustomersFromStorage();
  }

  getCustomers(): Customer[] {
    return this.customers;
  }

  addCustomer(customer: Customer): void {
    if (!this.customers.some(c => c.username === customer.username)) {
      this.customers.push(customer);
      this.saveCustomersToStorage();
    }
  }

  // -----------------------------------
  private getCustomersFromStorage(): Customer[] {
    const customersJson = localStorage.getItem(this.storageKey);
    if (customersJson) {
      return JSON.parse(customersJson).map((customer: any) => ({
        ...customer,
        birthDate: new Date(customer.birthDate) // strings -> date objs
      }));
    }
    return [];
  }

  private saveCustomersToStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.customers));
  }

  deleteCustomer(customer: Customer): void {
    this.customers = this.customers.filter(c => c !== customer);
    this.saveCustomersToStorage();
  }

}
