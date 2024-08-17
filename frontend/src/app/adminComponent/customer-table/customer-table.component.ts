import { Component, OnInit } from '@angular/core';
import { CustomerService, Customer } from '../../customer.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CustomerFormComponent } from '../customer-form/customer-form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CustomerTableRowComponent } from '../customer-table-row/customer-table-row.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-customer-table',
  standalone: true,


  imports: [
    MatTableModule,
    RouterOutlet,
    CommonModule,
    CustomerTableRowComponent,
    MatDialogModule
  ],
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.css']
})

export class CustomerTableComponent implements OnInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'username', 'email', 'phoneNumber', 'idNumber', 'actions'];
  dataSource = new MatTableDataSource<Customer>();

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

  deleteCustomer(customer: Customer): void {
    const index = this.dataSource.data.indexOf(customer);
    if (index >= 0) {
      this.customerService.deleteCustomer(customer);
      this.loadCustomers(); ////
    }
  }

  editCustomer(customer: Customer): void {
    const dialogRef = this.dialog.open(CustomerFormComponent, {
      panelClass: 'custom-dialog-container',
      data: { customer } 
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customerService.updateCustomer(result); // Update customer
        this.loadCustomers();
      }
    });
  }

}