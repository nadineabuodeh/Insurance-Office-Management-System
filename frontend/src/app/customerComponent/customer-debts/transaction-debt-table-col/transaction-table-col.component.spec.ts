import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionDebtTableColComponent } from './transaction-table-col.component';

describe('TransactionDebtTableColComponent', () => {
  let component: TransactionDebtTableColComponent;
  let fixture: ComponentFixture<TransactionDebtTableColComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionDebtTableColComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionDebtTableColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
