import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CustomerFormComponent } from '../customer-form/customer-form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CustomerTableRowComponent } from '../customer-table-row/customer-table-row.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCard, MatCardContent } from '@angular/material/card';
import { Customer, CustomerService } from '../../../service/customer.service';

@Component({
  selector: 'app-customer-table',
  standalone: true,


  imports: [
    MatTableModule, MatCard, MatCardContent,
    RouterOutlet,
    CommonModule, FormsModule,
    CustomerTableRowComponent,
    MatDialogModule,
  ],
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.css']
})

export class CustomerTableComponent implements OnInit {

  // displayedColumns: string[] = ['firstName', 'lastName', 'username', 'email', 'phoneNumber', 'idNumber', 'actions'];
  displayedColumns: string[] = ['firstName', 'lastName', 'username', 'email', 'phoneNumber', 'actions'];

  dataSource = new MatTableDataSource<Customer>();
  isSearchActive = false;
  searchTerm: string = '';


  constructor(
    private customerService: CustomerService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.dataSource.data = this.customerService.getCustomers();
  }


  onAddButtonClick(): void { // opens the dialog..
    const dialogRef = this.dialog.open(CustomerFormComponent, {
      panelClass: 'custom-dialog-container', //css class

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customerService.addCustomer(result);
        this.loadCustomers();
      }
    });
  }


  deleteCustomer(id: number): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      console.log(id + ":   id")
      this.customerService.deleteCustomer(id);

      this.loadCustomers();
    }
  }


  editCustomer(customer: Customer): void {
    const dialogRef = this.dialog.open(CustomerFormComponent, {
      panelClass: 'custom-dialog-container',
      data: { customer }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.customerService.updateCustomer(result); // Update customer
        this.customerService.updateCustomer(customer.id, result); // Update customer bt id
        this.loadCustomers();
      }
    });
  }


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