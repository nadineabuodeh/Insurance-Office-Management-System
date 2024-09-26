import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionTableColComponentCustomer } from './transaction-table-col.component';

describe('TransactionTableColComponentCustomer', () => {
  let component: TransactionTableColComponentCustomer;
  let fixture: ComponentFixture<TransactionTableColComponentCustomer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionTableColComponentCustomer],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionTableColComponentCustomer);
    component = fixture.componentInstance;

    component.transaction = {
      id: 1,
      amount: 1000,
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      transactionType: 'DEPOSIT',
      userId: 1,
      policyId: 1,
    };

    component.column = 'amount';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct value for the column', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('1000');
  });
});