import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionDebtTableComponent } from './transaction-table.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { TransactionService, Transaction } from '../../../service/TransactionService/transaction.service';
import { of } from 'rxjs';

describe('TransactionDebtTableComponent', () => {
  let component: TransactionDebtTableComponent;
  let fixture: ComponentFixture<TransactionDebtTableComponent>;
  let transactionService: jasmine.SpyObj<TransactionService>;

  beforeEach(async () => {
    const transactionServiceSpy = jasmine.createSpyObj('TransactionService', ['getDebtTransactions']);

    await TestBed.configureTestingModule({
      imports: [
        TransactionDebtTableComponent,
        HttpClientTestingModule,
        MatDialogModule,
        MatTableModule,
      ],
      providers: [
        { provide: TransactionService, useValue: transactionServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionDebtTableComponent);
    component = fixture.componentInstance;
    transactionService = TestBed.inject(TransactionService) as jasmine.SpyObj<TransactionService>;

    transactionService.getDebtTransactions.and.returnValue(of([
      {
        id: 1,
        startDate: '2023-01-01',
        amount: 1000,
        endDate: '2023-12-31',
        transactionType: 'DEBT',
        userId: 123,
        policyId: 456
      } as Transaction
    ]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load debt transactions', () => {
    component.loadTransactions();
    expect(transactionService.getDebtTransactions).toHaveBeenCalled();
    expect(component.dataSource.data.length).toBeGreaterThan(0);
  });

  it('should display the correct columns', () => {
    expect(component.displayedColumns).toEqual(['startDate', 'endDate', 'amount', 'createdAt', 'updatedAt']);
  });
});