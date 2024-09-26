import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerTransactionComponent } from './customer-transaction.component';
import { TransactionService } from '../../../service/TransactionService/transaction.service';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CustomerTransactionComponent', () => {
  let component: CustomerTransactionComponent;
  let fixture: ComponentFixture<CustomerTransactionComponent>;
  let mockTransactionService: jasmine.SpyObj<TransactionService>;

  const mockTransactions = [
    { id: 1, startDate: '2023-01-01', endDate: '2023-01-31', amount: 100, transactionType: 'DEPOSIT', userId: 1, policyId: 1 },
    { id: 2, startDate: '2023-02-01', endDate: '2023-02-28', amount: 200, transactionType: 'DEBT', userId: 1, policyId: 1 },
  ];

  beforeEach(async () => {
    mockTransactionService = jasmine.createSpyObj('TransactionService', ['getTransactionsByCustomerId', 'deleteTransaction']);
    mockTransactionService.getTransactionsByCustomerId.and.returnValue(of(mockTransactions));
    mockTransactionService.deleteTransaction.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [
        CustomerTransactionComponent,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        NoopAnimationsModule,
        HttpClientTestingModule, 
      ],
      providers: [
        { provide: TransactionService, useValue: mockTransactionService },
        { provide: MatDialog, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', async () => {
    expect(component).toBeTruthy();
  });

  it('should load transactions on init', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(mockTransactionService.getTransactionsByCustomerId).toHaveBeenCalled();
    expect(component.dataSource.data.length).toBe(2);
  });

  it('should filter by transaction type', async () => {
    component.selectedTransactionType = 'DEPOSIT';
    component.applyFilter();
    fixture.detectChanges();
    await fixture.whenStable(); 
    expect(component.dataSource.filter).toBe('deposit'); 
  });

  it('should delete a transaction', async () => {
    spyOn(window, 'confirm').and.returnValue(true); 
    component.deleteTransaction(1);
    fixture.detectChanges();
    await fixture.whenStable(); 
    expect(mockTransactionService.deleteTransaction).toHaveBeenCalledWith(1);
  });
});