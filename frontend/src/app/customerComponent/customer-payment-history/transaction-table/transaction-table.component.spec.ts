import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { TransactionCustomerTableComponent } from './transaction-table.component';
import { TransactionService } from '../../../service/TransactionService/transaction.service';
import { of } from 'rxjs';

describe('TransactionCustomerTableComponent', () => {
  let component: TransactionCustomerTableComponent;
  let fixture: ComponentFixture<TransactionCustomerTableComponent>;
  let transactionService: TransactionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TransactionCustomerTableComponent,
        HttpClientTestingModule,
        MatDialogModule
      ],
      providers: [TransactionService],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionCustomerTableComponent);
    component = fixture.componentInstance;
    transactionService = TestBed.inject(TransactionService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load transactions on init', () => {
    const transactionsMock = [
      {
        id: 1,
        startDate: '2024-01-01',
        amount: 1000,
        endDate: '2024-12-31',
        transactionType: 'DEPOSIT',
        userId: 123,
        policyId: 456,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z'
      }
    ];
    spyOn(transactionService, 'getDepositTransactions').and.returnValue(of(transactionsMock));

    component.loadTransactions();

    expect(component.dataSource.data).toEqual(transactionsMock);
    expect(transactionService.getDepositTransactions).toHaveBeenCalled();
  });
});