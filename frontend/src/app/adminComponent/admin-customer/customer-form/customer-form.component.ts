import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { CustomerFormFieldsComponent } from '../customer-form-fields/customer-form-fields.component';
import {
  Customer,
  CustomerService,
} from '../../../service/CustomerService/customer.service';
import { Subscription } from 'rxjs';
import { LoadingService } from '../../../service/loading.service';

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
  styleUrls: ['./customer-form.component.css'],
})
export class CustomerFormComponent {
  customerForm: FormGroup;
  customers: Customer[] = [];

  isEditMode: boolean = false;
  existingCustomerData: any;
  customerName: string = '';

  maxDate: Date;
  minDate: Date;

  private initialFormValue: any;
  private subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private dialogRef: MatDialogRef<CustomerFormComponent>,
    private dialog: MatDialog,
    private loadingService: LoadingService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.maxDate = new Date();
    this.minDate = new Date();
    this.minDate.setFullYear(this.minDate.getFullYear() - 18);

    this.customerForm = this.fb.group(
      {
        id: [this.data?.customer?.id || null],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        birthDate: ['', [Validators.required, this.minAgeValidator]],
        username: [
          '',
          [Validators.required, Validators.pattern(/^[a-zA-Z0-9_]+$/)],
        ],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: [
          '',
          [Validators.required, Validators.pattern(/^\d{10}$/)],
        ],
        idNumber: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      },
      {}
    );
    this.dialogRef.disableClose = true;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadCustomers(): void {
    this.subscription.add(
      this.customerService.getCustomers().subscribe((customers) => {
        this.customers = customers;
      })
    );
  }

  ngOnInit() {
    if (this.data && this.data.customer) {
      this.initialFormValue = this.data.customer;
      this.customerForm.patchValue(this.data.customer);
      this.isEditMode = true;
      this.customerName = `${this.data.customer.firstName} ${this.data.customer.lastName}`;
    }
    this.loadCustomers();
  }

  minAgeValidator(control: any) {
    const today = new Date();
    const minDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    if (control.value && control.value > minDate) {
      return { minAge: true };
    }
    return null;
  }

  onSubmit() {
    if (this.customerForm.valid) {
      const customerData: Customer = {
        ...this.customerForm.value,
        role: 'ROLE_CUSTOMER'
      };

      if (this.isEmailDuplicate(customerData.email)) {
        this.customerForm.get('email')?.setErrors({ duplicate: true });
        return;
      }

      if (this.isPhoneNumberDuplicate(customerData.phoneNumber)) {
        this.customerForm.get('phoneNumber')?.setErrors({ duplicate: true });
        return;
      }

      if (this.isIDnumberDuplicate(customerData.idNumber)) {
        this.customerForm.get('idNumber')?.setErrors({ duplicate: true });
        return;
      }

      if (this.isUserNameDuplicate(customerData.username)) {
        this.customerForm.get('username')?.setErrors({ duplicate: true });
        return;
      }

      this.loadingService.loadingOn();

      if (this.isEditMode) {
        this.customerService
          .updateCustomer(this.data.customer.id, customerData)
          .subscribe(
            () => {
              this.loadingService.loadingOff();
              this.dialogRef.close(customerData);
            },
            () => {
              this.loadingService.loadingOff();
            }
          );
      } else {
        this.customerService.addCustomer(customerData).subscribe(
          () => {
            this.loadingService.loadingOff();
            this.dialogRef.close(customerData);
          },
          () => {
            this.loadingService.loadingOff();
          }
        );
      }
    }
  }

  isEmailDuplicate(email: string): boolean {
    return this.customers.some(
      (customer) =>
        customer.email === email &&
        (!this.isEditMode || customer.id !== this.initialFormValue.id)
    );
  }

  isUserNameDuplicate(username: string): boolean {
    return this.customers.some(
      (customer) =>
        customer.username === username &&
        (!this.isEditMode || customer.id !== this.initialFormValue.id)
    );
  }

  isPhoneNumberDuplicate(phoneNumber: String): boolean {
    return this.customers.some(
      (customer) =>
        customer.phoneNumber === phoneNumber &&
        (!this.isEditMode || customer.id !== this.initialFormValue.id)
    );
  }

  isIDnumberDuplicate(idNumber: String): boolean {
    return this.customers.some(
      (customer) =>
        customer.idNumber === idNumber &&
        (!this.isEditMode || customer.id !== this.initialFormValue.id)
    );
  }
}
