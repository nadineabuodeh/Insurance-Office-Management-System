import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminUpcomingTransactionComponent } from './admin-upcoming-transaction.component';
import { MatTableModule } from '@angular/material/table';
import { TransactionService } from '../../../service/TransactionService/transaction.service';
import { of } from 'rxjs';

describe('AdminUpcomingTransactionComponent', () => {
  let component: AdminUpcomingTransactionComponent;
  let fixture: ComponentFixture<AdminUpcomingTransactionComponent>;
  let mockTransactionService: jasmine.SpyObj<TransactionService>;

  const mockTransactions = [
    {
      id: 1,
      startDate: '2024-01-01',
      amount: 200,
      endDate: '2024-01-10',
      transactionType: 'Deposit',
      createdAt: '2024-01-01T10:00:00',
      updatedAt: '2024-01-02T11:00:00',
      userId: 1,
      policyId: 1
    },
    {
      id: 2,
      startDate: '2024-01-15',
      amount: 500,
      endDate: '2024-01-20',
      transactionType: 'Debt',
      createdAt: '2024-01-05T10:00:00',
      updatedAt: '2024-01-10T11:00:00',
      userId: 2,
      policyId: 2
    }
  ];

  beforeEach(async () => {
    mockTransactionService = jasmine.createSpyObj('TransactionService', ['getUpcomingTransactions']);
    mockTransactionService.getUpcomingTransactions.and.returnValue(of(mockTransactions));

    await TestBed.configureTestingModule({
      imports: [AdminUpcomingTransactionComponent, MatTableModule],
      providers: [{ provide: TransactionService, useValue: mockTransactionService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminUpcomingTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load upcoming transactions on init', () => {
    expect(mockTransactionService.getUpcomingTransactions).toHaveBeenCalled();
    expect(component.dataSource.data.length).toBe(2);
  });

  it('should display the correct transaction details', () => {
    const transaction = component.dataSource.data[0];
    expect(transaction.startDate).toBe('2024-01-01');
    expect(transaction.amount).toBe(200);
    expect(transaction.transactionType).toBe('Deposit');
  });
});