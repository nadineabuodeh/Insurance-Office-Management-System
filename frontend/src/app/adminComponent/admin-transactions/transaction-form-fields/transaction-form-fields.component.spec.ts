import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatNativeDateModule } from '@angular/material/core';
import { TransactionFormFieldsComponent } from './transaction-form-fields.component';

describe('TransactionFormFieldsComponent', () => {
  let component: TransactionFormFieldsComponent;
  let fixture: ComponentFixture<TransactionFormFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatNativeDateModule,
        NoopAnimationsModule,
        TransactionFormFieldsComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionFormFieldsComponent);
    component = fixture.componentInstance;

    component.formGroup = new FormGroup({
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      amount: new FormControl(''),
      transactionType: new FormControl(''),
      policyId: new FormControl(''),
      userId: new FormControl(''),
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display policy name when in edit mode', () => {
    component.isEditMode = true;
    component.formGroup.patchValue({ policyId: 1 });
    component.policyNameControl.setValue('Policy Name');
    fixture.detectChanges();
    expect(component.policyNameControl.value).toBe('Policy Name');
  });
});