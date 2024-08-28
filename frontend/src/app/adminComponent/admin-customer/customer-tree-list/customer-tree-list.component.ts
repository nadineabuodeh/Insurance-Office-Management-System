import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TreeModule } from 'primeng/tree';
import { SplitterModule } from 'primeng/splitter';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Customer, CustomerService } from '../../../service/CustomerService/customer.service';
import { CustomerDetailsComponent } from "../customer-details/customer-details.component";
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CustomerFormComponent } from '../customer-form/customer-form.component';

@Component({
  selector: 'app-customer-tree-list',
  standalone: true,
  imports: [CustomerFormComponent, CommonModule, MatDialogModule, HttpClientModule, TreeModule, SplitterModule, FormsModule, CustomerDetailsComponent],
  templateUrl: './customer-tree-list.component.html',
  styleUrls: ['./customer-tree-list.component.css']
})
export class CustomerTreeListComponent implements OnInit {
  searchQuery: string = '';
  customers: Customer[] = [];
  errorMessage: string = '';
  selectedCustomer?: Customer;
  @Output() customerSelected = new EventEmitter<Customer>();
  private subscription: Subscription = new Subscription();

  constructor(private customerService: CustomerService, public dialog: MatDialog, private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchCustomers();

    this.subscription.add(
      this.customerService.customersChanged$.subscribe(() => this.fetchCustomers()) //update the ui
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  fetchCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (data: Customer[]) => {
        this.customers = data;
        this.errorMessage = this.customers.length === 0 ? 'No customers available.' : '';

      },
      error: (err: any) => {
        this.errorMessage = 'Error fetching';
      }
    });
  }


  filteredCustomers() {
    return this.customers.filter(customer =>
      (customer.firstName + ' ' + customer.lastName).toLowerCase().includes(this.searchQuery.toLowerCase())
    );


  }


  onCustomerClick(customer: Customer): void {
    this.router.navigate(['/admin/customer', customer.id]);
  }


  onAddButtonClick(): void {
    const dialogRef = this.dialog.open(CustomerFormComponent, {
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customerService.addCustomer(result).subscribe(() => {
          this.fetchCustomers();
        });
      }
    });
  }

}
