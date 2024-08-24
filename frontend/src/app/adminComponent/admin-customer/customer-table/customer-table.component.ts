import { interval, Subscription } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CustomerFormComponent } from '../customer-form/customer-form.component';
import { Customer, CustomerService } from '../../../service/customer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCard, MatCardContent } from '@angular/material/card';
import { Router, RouterOutlet } from '@angular/router';
import { CustomerTableRowComponent } from '../customer-table-row/customer-table-row.component';
import { CustomerDetailsComponent } from "../customer-details/customer-details.component";
import { CustomerTreeListComponent } from '../customer-tree-list/customer-tree-list.component';
import { TreeModule } from 'primeng/tree';

@Component({
  selector: 'app-customer-table', standalone: true,
  imports: [
    FormsModule,
    MatTableModule,
    MatCard,
    MatCardContent,
    RouterOutlet,
    CommonModule,
    CustomerTableRowComponent,
    MatDialogModule,
    CustomerDetailsComponent, CustomerTreeListComponent, TreeModule, CustomerDetailsComponent
  ],
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.css']
})
export class CustomerTableComponent implements OnInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'username', 'email', 'phoneNumber', 'idNumber', 'actions'];
  dataSource = new MatTableDataSource<Customer>();
  isSearchActive = false;
  searchTerm: string = '';
  private subscription: Subscription = new Subscription();

  @Input() selectedCustomer2?: Customer;
  selectedCustomer: any;


  constructor(private customerService: CustomerService, public dialog: MatDialog, private router: Router) { }




  ngOnInit(): void {
    this.loadCustomers();
    this.subscription.add(
      interval(500).subscribe(() => this.loadCustomers())
    );
  }

  onCustomerSelected(customer: Customer): void {
    this.selectedCustomer = customer;
    this.router.navigate(['/admin/customer', customer.id]);
    console.log("TABLE customer selected: " + customer.id + " , name: " + customer.firstName)
  }
  /////////////////////////////////

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe(customers => {
      this.dataSource.data = customers;
    });
  }
  // =========================================

  onAddButtonClick(): void { //donne
    const dialogRef = this.dialog.open(CustomerFormComponent, {
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customerService.addCustomer(result).subscribe(() => {
          this.loadCustomers();
        });
      }
    });
  }
  // =========================================
  deleteCustomer(id: number): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id).subscribe(() => {
        this.loadCustomers();
      });
    }
  }
  // =========================================

  editCustomer(customer: Customer): void {
    const dialogRef = this.dialog.open(CustomerFormComponent, {
      panelClass: 'custom-dialog-container',
      data: { customer }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customerService.updateCustomer(customer.id, result).subscribe(() => {
          this.loadCustomers();
        });
      }
    });
  }
  // =========================================

  toggleSearch() {
    this.isSearchActive = !this.isSearchActive;
    const searchBar = document.querySelector('.search-bar') as HTMLInputElement;
    const buttonText = document.querySelector('.button-text');
    const button = document.querySelector('.add-search-btns');

    if (this.isSearchActive) {
      if (searchBar) {
        searchBar.classList.add('active');
        searchBar.focus();
      }
      if (buttonText) {
        buttonText.classList.add('hidden');
      }
      if (button) {
        button.classList.add('minimized');
      }
    } else {
      if (searchBar) {
        searchBar.classList.remove('active');
      }
      if (buttonText) {
        buttonText.classList.remove('hidden');
      }
      if (button) {
        button.classList.remove('minimized');
      }
    }
  }

  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: Customer, filter: string) => {
      return data.firstName.toLowerCase().includes(filter) || data.lastName.toLowerCase().includes(filter);
    };
    this.dataSource.filter = filterValue;
  }




}
