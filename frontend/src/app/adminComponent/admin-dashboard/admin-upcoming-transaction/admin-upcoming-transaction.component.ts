import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  Transaction,
  TransactionService,
} from '../../../service/TransactionService/transaction.service';
import { TransactionTableColComponent } from '../../admin-transactions/transaction-table-col/transaction-table-col.component';
import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { AdminSidebarComponent } from "../../admin-sidebar/admin-sidebar.component";

@Component({
  selector: 'app-admin-upcoming-transaction',
  standalone: true,
  imports: [TransactionTableColComponent, CommonModule, MatTableModule, AdminSidebarComponent],
  templateUrl: './admin-upcoming-transaction.component.html',
  styleUrl: './admin-upcoming-transaction.component.css',
})
export class AdminUpcomingTransactionComponent {
  displayedColumns: string[] = [
    'startDate',
    'endDate',
    'amount',
    'transactionType',
    'username',
    'createdAt',
    'updatedAt',
  ];
  dataSource = new MatTableDataSource<Transaction>();

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  ngOnChanges(changes: SimpleChanges): void {
      this.dataSource.data = [];
      this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionService
      .getUpcomingTransactions()
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
