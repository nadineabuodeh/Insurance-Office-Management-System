import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TreeModule } from 'primeng/tree';
import { SplitterModule } from 'primeng/splitter';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Customer, CustomerService } from '../../../service/customer.service';
import { CustomerDetailsComponent } from "../customer-details/customer-details.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-tree-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, TreeModule, SplitterModule, FormsModule, CustomerDetailsComponent],
  templateUrl: './customer-tree-list.component.html',
  styleUrls: ['./customer-tree-list.component.css']
})
export class CustomerTreeListComponent implements OnInit {
  searchQuery: string = '';
  customers: Customer[] = [];
  errorMessage: string = '';
  selectedCustomer?: Customer;
  @Output() customerSelected = new EventEmitter<Customer>();

  constructor(private customerService: CustomerService, private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchCustomers();
  }

  ////////////////////////

  fetchCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (data: Customer[]) => {
        this.customers = data;
      },
      error: (err: any) => {
        console.error('Error fetching customers:', err);
        this.errorMessage = 'Failed to fetch customers. Please try again later.';
      }
    });
  }
  ///////////////////////
  filteredCustomers() {
    return this.customers.filter(customer =>
      (customer.firstName + ' ' + customer.lastName).toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }


  onCustomerClick(customer: Customer): void {
    this.router.navigate(['/admin/customer', customer.id]); 
  }

}
