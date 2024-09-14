import { Component, Input, OnInit } from '@angular/core';
import {
  Customer,
  CustomerService,
} from '../../../service/CustomerService/customer.service';
import { ActivatedRoute } from '@angular/router';
import { CustomerTreeListComponent } from '../customer-tree-list/customer-tree-list.component';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CustomerFormComponent } from '../customer-form/customer-form.component';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { PolicyLayoutComponent } from '../policy-layout/policy-layout.component';
import { CollapsibleSectionComponent } from '../collapsible-section/collapsible-section.component';
import { TransactionTableComponent } from '../../admin-transactions/transaction-table/transaction-table.component';
import { CustomerTransactionComponent } from '../customer-transaction/customer-transaction.component';
import { LoadingService } from '../../../service/loading.service';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [
    CustomerTreeListComponent,
    DatePipe,
    PolicyLayoutComponent,
    CommonModule,
    CollapsibleSectionComponent,
    TransactionTableComponent,
    CustomerTransactionComponent,
  ],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.css',
})
export class CustomerDetailsComponent implements OnInit {
  @Input() errorMessage: string = '';
  visible = false;

  customer: Customer | undefined;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    public dialog: MatDialog,
    private location: Location,
    private loadingService: LoadingService,
  ) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.paramMap.subscribe((params) => {
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
              },
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
      this.loadingService.loadingOn();
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          this.loadingService.loadingOff();
          this.location.back();
        },
        error: (err) => {
          this.loadingService.loadingOff();
          console.error('Error deleting customer:', err);
        }
      });
    }
  }


  editCustomer(customer: Customer): void {
    const dialogRef = this.dialog.open(CustomerFormComponent, {
      panelClass: 'custom-dialog-container',
      data: { customer }
    });
  
    this.subscriptions.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadingService.loadingOn();
          
          this.subscriptions.add(
            this.customerService.updateCustomer(customer.id, result).subscribe({
              next: () => {
                this.refreshCustomerData(customer.id);
                this.loadingService.loadingOff();
              },
              error: (err) => {
                this.loadingService.loadingOff();
                console.error('Error updating customer:', err);
              }
            })
          );
        }
      })
    );
  }

  private refreshCustomerData(customerId: number): void {
    this.subscriptions.add(
      this.customerService.getCustomerById(customerId).subscribe({
        next: (data: Customer) => {
          this.customer = data;
        },
        error: (err) => {
          console.error('Error fetching customer details:', err);
        }
      })
    );
  }


  toggleCollapse(): void {
    this.visible = !this.visible;
  }
}
