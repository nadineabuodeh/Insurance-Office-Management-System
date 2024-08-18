import { Component, Input } from '@angular/core';
import { Customer } from '../../../service/customer.service';

@Component({
  selector: 'app-customer-table-row',
  standalone: true,
  imports: [], template: `
  <span>{{ getValue() }}</span>
`,
  // templateUrl: './customer-table-row.component.html',
  styleUrl: './customer-table-row.component.css'
})
export class CustomerTableRowComponent {
  @Input() customer!: Customer;
  @Input() column!: string;


  getValue(): string {
    return (this.customer as any)[this.column] || '';
  }
}
