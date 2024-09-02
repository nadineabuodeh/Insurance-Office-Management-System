import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  Transaction,
  TransactionService,
} from '../../../service/TransactionService/transaction.service';
import { TransactionTableColComponent } from '../../admin-transactions/transaction-table-col/transaction-table-col.component';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-customer-transaction',
  standalone: true,
  imports: [TransactionTableColComponent, CommonModule, MatTableModule],
  templateUrl: './customer-transaction.component.html',
  styleUrl: './customer-transaction.component.css',
})
export class CustomerTransactionComponent {
  @Input() customerId!: number;
  displayedColumns: string[] = [
    'startDate',
    'endDate',
    'amount',
    'transactionType',
    'createdAt',
    'updatedAt',
  ];
  dataSource = new MatTableDataSource<Transaction>();

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customerId'] && this.customerId) {
      this.dataSource.data = [];
      this.loadTransactions();
    }
  }

  loadTransactions(): void {
    this.transactionService
      .getTransactionsByCustomerId(this.customerId)
      .subscribe(
        (transactions) => {
          this.dataSource.data = transactions;
        },
        (error) => {
          console.error('Error loading transactions:', error);
          this.dataSource.data = [];
        }
      );
  }
}
