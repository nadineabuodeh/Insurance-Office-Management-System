import { Component, Input, OnInit } from '@angular/core';
import { Customer, CustomerService } from '../../../service/customer.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.css'
})
export class CustomerDetailsComponent implements OnInit {

  customer: Customer | undefined;

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.customerService.getCustomerById(Number(id)).subscribe({
          
          next: (data: Customer) => {
            this.customer = data;
            console.log("FIRST NAME: "+this.customer.firstName)
          },
          error: (err) => {
            console.error('Error fetching customer details:', err);
          }
        });
      }
    });
  }
}
