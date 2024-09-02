import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionTableColComponent } from './transaction-table-col.component';

describe('TransactionTableColComponent', () => {
  let component: TransactionTableColComponent;
  let fixture: ComponentFixture<TransactionTableColComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionTableColComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionTableColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
