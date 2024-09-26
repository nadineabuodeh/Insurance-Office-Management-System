import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionDebtTableColComponent } from './transaction-table-col.component';
import { Transaction } from './../../../service/TransactionService/transaction.service';

describe('TransactionDebtTableColComponent', () => {
  let component: TransactionDebtTableColComponent;
  let fixture: ComponentFixture<TransactionDebtTableColComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionDebtTableColComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionDebtTableColComponent);
    component = fixture.componentInstance;

    component.transaction = {
      id: 1,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      amount: 1000,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
      userId: 123,
      policyId: 456,
      transactionType: 'DEBT'
    } as Transaction;

    component.column = 'amount';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct value from the transaction', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('1000');
  });
});