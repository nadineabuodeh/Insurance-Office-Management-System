import { CommonModule } from '@angular/common';
import { Transaction } from './../../../service/TransactionService/transaction.service';
import { Component, Input } from '@angular/core';
import { CurrencyService } from '../../../service/currency.service';

@Component({
  selector: 'app-transaction-table-col',
  standalone: true,
  imports: [CommonModule],
  template: `
  @if(column === 'amount'){
  <span>
    {{ transaction.amount |  currency: selectedCurrency:'symbol':'1.2-2' }}
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
  selectedCurrency: string = '';

  constructor(private currencyService: CurrencyService) { }


  ngOnInit(): void {
    this.getAdminCurrency()
  }

  getAdminCurrency(): void {
    this.currencyService.getAdminCurrency().subscribe({
      next: (currency: string) => {
        this.selectedCurrency = currency === 'NIS' ? 'ILS' : currency;
        console.log("policy table currency -> " + this.selectedCurrency)
      },
      error: (err) => {
        console.error('Error fetching currency:', err);
      }
    });
  }

  getValue(): string {
    return (this.transaction as any)[this.column] || '';
  }
}
