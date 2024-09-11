import { DatePipe, CurrencyPipe, CommonModule } from "@angular/common";
import { Component, OnInit, AfterViewInit, ViewChild, Input, SimpleChanges, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { MatDialogModule, MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule, MatSort } from "@angular/material/sort";
import { MatTableModule, MatTableDataSource } from "@angular/material/table";

import { Transaction, TransactionService } from "../../../service/TransactionService/transaction.service";
import { TransactionFormComponent } from "../transaction-form/transaction-form.component";
import { TransactionTableColComponent } from "../transaction-table-col/transaction-table-col.component";



@Component({
  selector: 'app-transaction-table',
  standalone: true,
  imports: [
    FormsModule,
    MatTableModule, DatePipe, CurrencyPipe,
    MatDialogModule, CommonModule,
    TransactionTableColComponent, MatFormFieldModule, MatInputModule, MatSelectModule, MatSortModule, MatSort
  ],
  templateUrl: './transaction-table.component.html',
  styleUrls: ['./transaction-table.component.css'],
})


export class TransactionTableComponent implements OnInit {
  @Input() customerId!: number;

  sortDirection: 'asc' | 'desc' = 'asc';
  dataSource = new MatTableDataSource<Transaction>();
  selectedColumn: string = 'transactionType';
  columnOptions: string[] = ['transactionType', 'amount'];
  showFilter: boolean = false;
  selectedTransactionType: string = '';


  displayedColumns: string[] = [
    'startDate',
    'endDate',
    'amount',
    'transactionType',
    'createdAt',
    'updatedAt',
    'actions',
  ];


  constructor(
    private transactionService: TransactionService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadTransactions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customerId'] && this.customerId) {
      this.dataSource.data = [];
      this.loadTransactions();
    }
  }
  toggleFilter() {
    this.showFilter = !this.showFilter;
  }


  get filterIcon(): string {
    return this.dataSource.data.length === 0
      ? './assets/no-filter.png'
      : './assets/filter-icon.png';
  }

  clearFilter() {
    const amountInput = document.querySelector('.filter-input') as HTMLInputElement;
    if (amountInput) {
      amountInput.value = '';
    }
    this.selectedTransactionType = '';
    this.dataSource.filter = '';
    this.dataSource.filterPredicate = (data: Transaction, filter: string) => true;
    this.loadTransactions();
  }


  loadTransactions(): void {
    this.transactionService.getAllTransactions().subscribe(transactions => {
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

  updateTransactionType(transaction: Transaction): void {
    if (transaction && transaction.id) {
      this.transactionService.updateTransactionType(transaction.id, transaction)
        .subscribe(
          updatedTransaction => {
            console.log('Transaction type updated:', updatedTransaction.transactionType);
            this.dataSource.data = [...this.dataSource.data];
            this.loadTransactions();
          },
          error => {
            console.error('Error updating transaction type:', error);
          }
        );
    } else {
      console.error('Transaction or ID is undefined');
    }
  }


  getIcon(transactionType: string): string {
    switch (transactionType) {
      case 'DEBT':
        return './assets/moneyyy.png';
      case 'DEPOSIT':
        return './assets/payed.png';
      default:
        return './assets/moneyyy.png';
    }
  }



  AmountFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    const filterValue = input ? input.value : '';

    this.dataSource.filterPredicate = (data: Transaction, filter: string) => {
      const columnValue = data[this.selectedColumn as keyof Transaction];
      return columnValue?.toString().toLowerCase().includes(filter.toLowerCase()) || false;
    };

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



  applyFilter() {
    if (this.selectedColumn === 'transactionType') {
      this.dataSource.filterPredicate = (data: Transaction, filter: string) => {


        const transactionTypeLower = data.transactionType.toLowerCase();
        const filterLower = filter.toLowerCase();

        const result = transactionTypeLower === filterLower || filterLower === '';
        return result;
      };
      this.dataSource.filter = this.selectedTransactionType.trim().toLowerCase();
    } else {
      this.dataSource.filterPredicate = (data: Transaction, filter: string) => {


        const dataStr = (data as any)[this.selectedColumn]?.toString().toLowerCase();

        const result = dataStr?.indexOf(filter.toLowerCase()) !== -1;
        return result;
      };
      this.dataSource.filter = this.selectedTransactionType.trim().toLowerCase();
    }
  }

  // Gets the value to sort by based on the column name.
  getSortingValue(item: Transaction, columnName: string): any {
    switch (columnName) {
      case 'startDate':
        return item.startDate ? new Date(item.startDate).getTime() : 0;

      case 'endDate':
        return item.endDate ? new Date(item.endDate).getTime() : 0;

      case 'amount':
        return item.amount;

      case 'transactionType':
        return item.transactionType;

      case 'createdAt':
        return item.createdAt ? new Date(item.createdAt).getTime() : 0;

      case 'updatedAt':
        return item.updatedAt ? new Date(item.updatedAt).getTime() : 0;

      default:
        return item[columnName as keyof Transaction] !== undefined
          ? String(item[columnName as keyof Transaction]).toLowerCase()
          : '';
    }
  }

  // Sorts the data by the selected column.
  sortData(column: string): void {
    const data = this.dataSource.data.slice();
    const isAsc = this.sortDirection === 'asc';
    this.sortDirection = isAsc ? 'desc' : 'asc';  // Toggle sort direction
    this.dataSource.data = data.sort((a, b) => {
      return this.compare(this.getSortingValue(a, column), this.getSortingValue(b, column), isAsc);
    });
  }

  // switching between (asc) & (desc) modes
  compare(a: any, b: any, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}  