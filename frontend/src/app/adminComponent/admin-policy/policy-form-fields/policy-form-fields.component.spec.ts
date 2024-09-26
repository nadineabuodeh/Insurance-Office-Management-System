import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PolicyFormFieldsComponent } from './policy-form-fields.component';
import { MatNativeDateModule } from '@angular/material/core';

describe('PolicyFormFieldsComponent', () => {
  let component: PolicyFormFieldsComponent;
  let fixture: ComponentFixture<PolicyFormFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PolicyFormFieldsComponent,
        HttpClientTestingModule,
        MatDialogModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [{ provide: MatDialogRef, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(PolicyFormFieldsComponent);
    component = fixture.componentInstance;

    component.formGroup = new FormGroup({
      userId: new FormControl(''),
      insuranceId: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      policyName: new FormControl(''),
      totalAmount: new FormControl(''),
      coverageDetails: new FormControl(''),
      installmentsEnabled: new FormControl(false),
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form controls correctly', () => {
    expect(component.formGroup.contains('userId')).toBeTrue();
    expect(component.formGroup.contains('insuranceId')).toBeTrue();
    expect(component.formGroup.contains('startDate')).toBeTrue();
    expect(component.formGroup.contains('endDate')).toBeTrue();
    expect(component.formGroup.contains('policyName')).toBeTrue();
    expect(component.formGroup.contains('totalAmount')).toBeTrue();
    expect(component.formGroup.contains('coverageDetails')).toBeTrue();
    expect(component.formGroup.contains('installmentsEnabled')).toBeTrue();
  });

  it('should update form control when userControl value changes', () => {
    const userName = 'John Doe';
    component.userControl.setValue(userName);
    const selectedUser = { id: 1, name: userName };
    component.users = [selectedUser];

    component.userControl.setValue(userName);
    expect(component.formGroup.get('userId')?.value).toEqual(selectedUser.id);
  });

  it('should update form control when insuranceControl value changes', () => {
    const insuranceName = 'Health Insurance';
    component.insuranceControl.setValue(insuranceName);
    const selectedInsurance = { id: 2, name: insuranceName };
    component.insurances = [selectedInsurance];

    component.insuranceControl.setValue(insuranceName);
    expect(component.formGroup.get('insuranceId')?.value).toEqual(selectedInsurance.id);
  });
});