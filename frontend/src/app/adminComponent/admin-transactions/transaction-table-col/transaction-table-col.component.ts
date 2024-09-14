import { CommonModule } from '@angular/common';
import { Transaction } from './../../../service/TransactionService/transaction.service';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-transaction-table-col',
  standalone: true,
  imports: [CommonModule],
  template: `
  @if(column === 'amount'){
  <span>
    {{ transaction.amount | currency: 'ILS':'symbol':'1.2-2' }}
  </span>
}
  @if(column !== 'amount'){
    <span >
  {{ getValue() }}
</span>
  }
`,
  styleUrl: './transaction-table-col.component.css',
})
export class TransactionTableColComponent {
  @Input() transaction!: Transaction;
  @Input() column!: string;

  getValue(): string {
    return (this.transaction as any)[this.column] || '';
  }
}
