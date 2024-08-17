import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../customer.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CustomerFormFieldsComponent } from '../customer-form-fields/customer-form-fields.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CustomerFormFieldsComponent
  ],
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})



export class CustomerFormComponent {
  customerForm: FormGroup;
  customers: any[] = [];


  constructor(private fb: FormBuilder,
    private customerService: CustomerService
    , private dialogRef: MatDialogRef<CustomerFormComponent>,
  ) {
    this.customerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      idNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    }, {
      validators: this.passwordMatchValidator
    });
  }


  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');

    if (password && confirmPassword) {
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ mismatch: true });
      } else {
        confirmPassword.setErrors(null); //clear error
      }
    }
  }

  onSubmit() {
    this.passwordMatchValidator(this.customerForm);

    if (this.customerForm.valid) {
      const newCustomer = this.customerForm.value;
      this.customerService.addCustomer(newCustomer);
      this.dialogRef.close(newCustomer);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
