import { Component, Input, OnInit } from '@angular/core';
import { Customer, CustomerService } from '../../../service/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerTreeListComponent } from "../customer-tree-list/customer-tree-list.component";
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CustomerFormComponent } from '../customer-form/customer-form.component';
import { Location } from '@angular/common';


@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [CustomerTreeListComponent, DatePipe],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.css'
})
export class CustomerDetailsComponent implements OnInit {
  @Input() errorMessage: string = '';

  customer: Customer | undefined;


  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    public dialog: MatDialog, private location: Location
  ) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.customerService.getCustomerById(Number(id)).subscribe({

          next: (data: Customer) => {
            if (data) {
              this.customer = data;
            } else {
              this.errorMessage = 'No customer found with the provided ID.';
            }
          },
          error: (err) => {
            this.errorMessage = 'Failed to load customer details. Please try again later.'; 

          }
        });
      }else {
        this.errorMessage = 'No customer ID provided.';
      }
    });
  }



  // =========================================


  deleteCustomer(id: number): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id).subscribe(() => {
        this.location.back();

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


          this.route.paramMap.subscribe(params => {   // Refresh customer data after update

            const id = params.get('id');
            if (id) {
              this.customerService.getCustomerById(Number(id)).subscribe({
                next: (data: Customer) => {
                  this.customer = data;
                },
                error: (err) => {
                  console.error('Error fetching customer details:', err);
                }
              });
            }
          });
        });
      }
    });
  }

}
