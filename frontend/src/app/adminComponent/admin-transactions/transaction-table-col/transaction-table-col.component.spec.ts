import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionTableColComponent } from './transaction-table-col.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TransactionTableColComponent', () => {
  let component: TransactionTableColComponent;
  let fixture: ComponentFixture<TransactionTableColComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionTableColComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionTableColComponent);
    component = fixture.componentInstance;

    component.transaction = {
      id: 1,
      amount: 1000,
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      transactionType: 'DEPOSIT'
    } as any;

    component.column = 'amount';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display formatted amount', () => {
    component.column = 'amount';
    fixture.detectChanges();
    const span = fixture.nativeElement.querySelector('span');
    expect(span.textContent).toContain('1,000.00');
  });

  it('should display transaction start date', () => {
    component.column = 'startDate';
    fixture.detectChanges();
    const span = fixture.nativeElement.querySelector('span');
    expect(span.textContent).toContain('2023-01-01');
  });
});