import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CustomerFormComponent } from '../customer-form/customer-form.component';
import { Customer, CustomerService } from '../../../service/customer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCard, MatCardContent } from '@angular/material/card';
import { RouterOutlet } from '@angular/router';
import { CustomerTableRowComponent } from '../customer-table-row/customer-table-row.component';

@Component({
  selector: 'app-customer-table', standalone: true,
  imports: [
    FormsModule, // Add FormsModule here
    MatTableModule,
    MatCard,
    MatCardContent,
    RouterOutlet,
    CommonModule,
    CustomerTableRowComponent,
    MatDialogModule,
  ],
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.css']
})
export class CustomerTableComponent implements OnInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'username', 'email', 'phoneNumber', 'idNumber', 'actions'];
  dataSource = new MatTableDataSource<Customer>();
  isSearchActive = false;
  searchTerm: string = '';

  constructor(private customerService: CustomerService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe(customers => {
      this.dataSource.data = customers;
    });
  }

  onAddButtonClick(): void {
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

  deleteCustomer(id: number): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id).subscribe(() => {
        this.loadCustomers();
      });
    }
  }

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
