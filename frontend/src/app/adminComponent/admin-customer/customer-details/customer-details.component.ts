import { Component, Input } from '@angular/core';
import { Customer } from '../../../service/customer.service';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.css'
})
export class CustomerDetailsComponent {
  @Input() customer?: Customer;

}
