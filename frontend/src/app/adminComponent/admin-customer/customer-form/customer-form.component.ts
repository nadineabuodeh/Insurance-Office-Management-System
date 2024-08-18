import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CustomerFormFieldsComponent } from '../customer-form-fields/customer-form-fields.component';
import { Customer, CustomerService } from '../../../service/customer.service';


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
    CustomerFormFieldsComponent,
  ],
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})



export class CustomerFormComponent {
  customerForm: FormGroup;
  customers: Customer[] = [];

  isEditMode: boolean = false; // check edit mode ..
  existingCustomerData: any;
  customerName: string = '';

  maxDate: Date;
  minDate: Date;

  private initialFormValue: any;


  constructor(private fb: FormBuilder
    , private customerService: CustomerService
    , private dialogRef: MatDialogRef<CustomerFormComponent>
    , private dialog: MatDialog
    , @Inject(MAT_DIALOG_DATA) public data: any 

  ) {
    this.maxDate = new Date(); 
    this.minDate = new Date();
    this.minDate.setFullYear(this.minDate.getFullYear() - 18); // Min age is 18 years ago


    this.customerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', [Validators.required, this.minAgeValidator]],
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      // idNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    }, {
      validators: this.passwordMatchValidator
    });
    this.dialogRef.disableClose = true; // **to prevent the dialog from closing when clicking outside..

  }



  ngOnInit() {
    if (this.data && this.data.customer) {
      this.initialFormValue = this.data.customer; this.customerForm.patchValue(this.data.customer);
      this.isEditMode = true;
      this.customerName = `${this.data.customer.firstName} ${this.data.customer.lastName}`; // set customerr name

    }
    this.customers = this.getCustomersFromLocalStorage();
  }
  getCustomersFromLocalStorage(): Customer[] {
    const customersJson = localStorage.getItem('customers');
    return customersJson ? JSON.parse(customersJson) : [];
  }



  minAgeValidator(control: any) {
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    if (control.value && control.value > minDate) {
      return { minAge: true };
    }
    return null;
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
    if (this.customerForm.valid) {
      const customerData: Customer = this.customerForm.value;
     
      if (this.isEmailDuplicate(customerData.email)) {
        this.customerForm.get('email')?.setErrors({ duplicate: true });
        return;
      }
  
      if (this.isPhoneNumberDuplicate(customerData.phoneNumber)) {
        this.customerForm.get('phoneNumber')?.setErrors({ duplicate: true });
        return;
      }
     
      if (this.isEditMode) {
        this.customerService.updateCustomer(customerData.id, customerData); //update
        // this.customerService.updateCustomer( customerData); //update

      } else {
        this.customerService.addCustomer(customerData);//add
      }
      this.dialogRef.close(customerData);
    }
  }

 isEmailDuplicate(email: string): boolean {
  return this.customers.some(customer => customer.email === email && (!this.isEditMode || customer.id !== this.initialFormValue.id));
}

isPhoneNumberDuplicate(phoneNumber: string): boolean {
  return this.customers.some(customer => customer.phoneNumber === phoneNumber && (!this.isEditMode || customer.id !== this.initialFormValue.id));
}

  
}
