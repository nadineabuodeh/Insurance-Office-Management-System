import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  Customer,
  CustomerService,
} from '../../service/CustomerService/customer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css'],
})
export class CustomerInfoComponent implements OnInit, OnDestroy {
  @Input() errorMessage: string = '';

  customer: Customer | undefined;
  private subscriptions: Subscription = new Subscription();

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.customerService.getCustomerInfo().subscribe({
        next: (data: Customer) => {
          if (data) {
            this.customer = data;
          } else {
            this.errorMessage = 'No customer found with this ID.';
          }
        },
        error: (err) => {
          this.errorMessage = 'Failed to load customer details.';
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}