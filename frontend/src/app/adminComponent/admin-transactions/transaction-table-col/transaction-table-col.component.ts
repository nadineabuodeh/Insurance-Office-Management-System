import { Transaction } from './../../../service/TransactionService/transaction.service';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-transaction-table-col',
  standalone: true,
  imports: [], template: `
  <span>{{ getValue() }}</span>`,

  styleUrl: './transaction-table-col.component.css'
})
export class TransactionTableColComponent {
  @Input() transaction!: Transaction;
  @Input() column!: string;


  getValue(): string {
    return (this.transaction as any)[this.column] || '';
  }
}
