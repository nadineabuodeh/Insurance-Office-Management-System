import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { CustomerFormFieldsComponent } from './customer-form-fields.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CustomerFormFieldsComponent', () => {
  let component: CustomerFormFieldsComponent;
  let fixture: ComponentFixture<CustomerFormFieldsComponent>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['closeAll']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonModule,
        MatDialogModule,
        NoopAnimationsModule,
        BrowserAnimationsModule, 
        CustomerFormFieldsComponent, 
      ],
      providers: [{ provide: MatDialog, useValue: mockDialog }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerFormFieldsComponent);
    component = fixture.componentInstance;

    component.formGroup = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{10}$/),
      ]),
      idNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{9}$/),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9_]+$/),
      ]),
      birthDate: new FormControl('', Validators.required),
    });

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should disable submit button when form is invalid', async () => {
    await fixture.whenStable();

    const submitButton = fixture.debugElement.query(
      By.css('button[color="primary"]')
    ); 

    if (submitButton) {
      expect(submitButton.nativeElement.disabled).toBeTrue();
    } else {
      fail('Submit button not found');
    }
  });

  it('should show phone number pattern validation error', async () => {
    const phoneInput = fixture.debugElement.query(By.css('input[formControlName="phoneNumber"]'));
  
    if (phoneInput) {
      phoneInput.nativeElement.value = '12345';
      phoneInput.nativeElement.dispatchEvent(new Event('input'));
  
      component.formGroup.controls['phoneNumber'].markAsTouched();
  
      fixture.detectChanges();
      await fixture.whenStable();
  
      const errorElement = fixture.debugElement.query(By.css('mat-error'));
      expect(errorElement).toBeTruthy();
      expect(errorElement.nativeElement.textContent).toContain('Phone number must be 10 digits');
    } else {
      fail('Phone Number input field not found');
    }
  });  
});
