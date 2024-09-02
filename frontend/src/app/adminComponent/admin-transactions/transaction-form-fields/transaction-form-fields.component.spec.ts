import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionFormFieldsComponent } from './transaction-form-fields.component';

describe('TransactionFormFieldsComponent', () => {
  let component: TransactionFormFieldsComponent;
  let fixture: ComponentFixture<TransactionFormFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionFormFieldsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionFormFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
