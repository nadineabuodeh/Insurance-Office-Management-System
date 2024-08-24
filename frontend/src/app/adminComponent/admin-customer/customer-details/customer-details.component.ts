import { Component, Input, OnInit } from '@angular/core';
import { Customer, CustomerService } from '../../../service/customer.service';
import { ActivatedRoute } from '@angular/router';
import { CustomerTreeListComponent } from "../customer-tree-list/customer-tree-list.component";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [CustomerTreeListComponent,DatePipe],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.css'
})
export class CustomerDetailsComponent implements OnInit {
 

  customer: Customer | undefined;
  activeRoute: any;
  
 

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
          },
          error: (err) => {
          }
        });
      }
    });
  }

}
