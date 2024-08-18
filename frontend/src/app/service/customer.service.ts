import { Injectable } from '@angular/core';

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
  private customers: Customer[] = [];

  private storageKey = 'customers';
  private nextId: number = 1;

  constructor() {
    this.customers = this.getCustomersFromStorage();
    this.nextId = this.customers.length > 0 ? Math.max(...this.customers.map(c => c.id)) + 1 : 1;

  }



  getCustomers(): Customer[] {
    return this.customers;
  }


  addCustomer(customer: Customer): void {
    if (!this.customers.some(c => c.username === customer.username)) {
      customer.id = this.nextId++;
      this.customers.push(customer);
      console.log("CHECK->" + customer.id + "," + customer.firstName)
      this.saveCustomersToStorage();
    }
  }

  deleteCustomer(id: number): void {
    this.customers = this.customers.filter(c => c.id !== id);
    this.saveCustomersToStorage();
  }

  updateCustomer(id: number, updatedCustomer: Customer): void {
    const index = this.customers.findIndex(c => c.id === id);
    if (index !== -1) {
      this.customers[index] = { ...this.customers[index], ...updatedCustomer };
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



}
