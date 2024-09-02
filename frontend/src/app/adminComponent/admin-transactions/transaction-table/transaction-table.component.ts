import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TransactionService } from './../../../service/TransactionService/transaction.service';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';
import { Transaction } from '../../../service/TransactionService/transaction.service';
import { TransactionTableColComponent } from '../transaction-table-col/transaction-table-col.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transaction-table',
  standalone: true,
  imports: [
    FormsModule,
    MatTableModule,
    MatDialogModule,
    TransactionTableColComponent,
  ],
  templateUrl: './transaction-table.component.html',
  styleUrls: ['./transaction-table.component.css'],
})
export class TransactionTableComponent implements OnInit {
  @Input() customerId!: number;
  dataSource = new MatTableDataSource<Transaction>();

  displayedColumns: string[] = [
    'startDate',
    'endDate',
    'amount',
    'transactionType',
    'createdAt',
    'updatedAt',
    'actions',
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
    this.transactionService.getAllTransactions().subscribe((transactions) => {
      this.dataSource.data = transactions;
    });
  }

  onAddTransactionClick(): void {
    const dialogRef = this.dialog.open(TransactionFormComponent, {
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTransactions();
      }
    });
  }

  editTransaction(transaction: Transaction): void {
    const dialogRef = this.dialog.open(TransactionFormComponent, {
      panelClass: 'custom-dialog-container',
      data: { transaction },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTransactions();
      }
    });
  }

  deleteTransaction(id: number): void {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService.deleteTransaction(id).subscribe(() => {
        this.loadTransactions();
      });
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
