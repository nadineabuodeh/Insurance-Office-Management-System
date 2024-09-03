import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionDebtTableComponent } from './transaction-table.component';

describe('TransactionDebtTableComponent', () => {
  let component: TransactionDebtTableComponent;
  let fixture: ComponentFixture<TransactionDebtTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionDebtTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionDebtTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
