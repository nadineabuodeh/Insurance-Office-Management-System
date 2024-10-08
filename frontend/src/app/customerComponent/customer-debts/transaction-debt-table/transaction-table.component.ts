import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TransactionService } from './../../../service/TransactionService/transaction.service';
import { Transaction } from '../../../service/TransactionService/transaction.service';
import { FormsModule } from '@angular/forms';
import { TransactionDebtTableColComponent } from '../transaction-debt-table-col/transaction-table-col.component';

@Component({
  selector: 'app-transaction-table',
  standalone: true,
  imports: [
    FormsModule,
    MatTableModule,
    MatDialogModule,
    TransactionDebtTableColComponent,
  ],
  templateUrl: './transaction-table.component.html',
  styleUrls: ['./transaction-table.component.css'],
})
export class TransactionDebtTableComponent implements OnInit {
  @Input() customerId!: number;
  dataSource = new MatTableDataSource<Transaction>();

  displayedColumns: string[] = [
    'startDate',
    'endDate',
    'amount',
    'createdAt',
    'updatedAt'
  ];
  searchTerm: string = '';

  constructor(
    private transactionService: TransactionService,
    public dialog: MatDialog
  ) {}

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
    this.transactionService.getDebtTransactions().subscribe((transactions) => {
      this.dataSource.data = transactions;
    });
  }
}
