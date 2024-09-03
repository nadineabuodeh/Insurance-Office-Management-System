import { Component, Input, OnInit } from '@angular/core';
import { Customer, CustomerService } from '../../../service/CustomerService/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerTreeListComponent } from "../customer-tree-list/customer-tree-list.component";
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CustomerFormComponent } from '../customer-form/customer-form.component';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { PolicyLayoutComponent } from "../policy-layout/policy-layout.component";
import { CollapsibleSectionComponent } from "../collapsible-section/collapsible-section.component";
import { TransactionTableComponent } from "../../admin-transactions/transaction-table/transaction-table.component";
import { CustomerTransactionComponent } from "../customer-transaction/customer-transaction.component";


@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [CustomerTreeListComponent, DatePipe, PolicyLayoutComponent, CommonModule, CollapsibleSectionComponent, TransactionTableComponent, CustomerTransactionComponent],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.css'
})
export class CustomerDetailsComponent implements OnInit {
  @Input() errorMessage: string = '';
  visible = false;

  customer: Customer | undefined;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    public dialog: MatDialog, private location: Location
  ) { }


  ngOnInit(): void {
    this.subscriptions.add(
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.subscriptions.add(
            this.customerService.getCustomerById(Number(id)).subscribe({
              next: (data: Customer) => {
                if (data) {
                  this.customer = data;
                  this.customer = data;
                } else {
                  this.errorMessage = 'no customer found with this ID.';
                }
              },
              error: (err) => {
                this.errorMessage = 'failed to load customer details..';
              }
            })
          );
        } else {
          this.errorMessage = 'No customer ID1';
        }
      })
    );
  }


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }



  deleteCustomer(id: number): void {

    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id).subscribe(() => {
        this.location.back();

      });
    }
  }

  // editCustomer(customer: Customer): void {
  //   const dialogRef = this.dialog.open(CustomerFormComponent, {
  //     panelClass: 'custom-dialog-container',
  //     data: { customer }
  //   });

  //   this.subscriptions.add(
  //     dialogRef.afterClosed().subscribe(result => {
  //       if (result) {
  //         this.subscriptions.add(
  //           this.customerService.updateCustomer(customer.id, result).subscribe(() => {
  //             this.subscriptions.add(
  //               this.route.paramMap.subscribe(params => { // Refresh customer data after update
  //                 const id = params.get('id');
  //                 if (id) {
  //                   this.customerService.getCustomerById(Number(id)).subscribe({
  //                     next: (data: Customer) => {
  //                       this.customer = data;
  //                     },
  //                     error: (err) => {
  //                       console.error('Error fetching customer details:', err);
  //                     }
  //                   });
  //                 }
  //               })
  //             );
  //           })
  //         );
  //       }
  //     })
  //   );
  // }

  editCustomer(customer: Customer): void {
    console.log('editCustomer called with:', customer);

    const dialogRef = this.dialog.open(CustomerFormComponent, {
        panelClass: 'custom-dialog-container',
        data: { customer }
    });

    this.subscriptions.add(
        dialogRef.afterClosed().subscribe(result => {
            console.log('Dialog closed with result:', result);
            if (result) {
                console.log('Updating customer with id:', customer.id, 'and data:', result);
                this.subscriptions.add(
                    this.customerService.updateCustomer(customer.id, result).subscribe(() => {
                        console.log('Customer updated successfully');
                        this.subscriptions.add(
                            this.route.paramMap.subscribe(params => {
                                const id = params.get('id');
                                console.log('Route param id:', id);
                                if (id) {
                                    this.customerService.getCustomerById(Number(id)).subscribe({
                                        next: (data: Customer) => {
                                            console.log('Fetched customer data:', data);
                                            this.customer = data;
                                        },
                                        error: (err) => {
                                            console.error('Error fetching customer details:', err);
                                        }
                                    });
                                }
                            })
                        );
                    }, error => {
                        console.error('Error updating customer:', error);
                    })
                );
            }
        }, error => {
            console.error('Error after dialog closed:', error);
        })
    );
}


  toggleCollapse(): void {
    this.visible = !this.visible;
  }
}
