import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { map, Observable, startWith } from 'rxjs';
import { CustomerService } from '../../../service/CustomerService/customer.service';
import { InsuranceService } from '../../../service/insurance.service';

@Component({
  selector: 'app-policy-form-fields',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatButtonModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatOptionModule,
  ],
  templateUrl: './policy-form-fields.component.html',
  styleUrl: './policy-form-fields.component.css',
})
export class PolicyFormFieldsComponent {
  @Input() formGroup!: FormGroup;
  @Input() isEditMode: boolean = false;

  userControl = new FormControl('');
  insuranceControl = new FormControl('');

  filteredUsers!: Observable<any[]>;
  filteredInsurances!: Observable<any[]>;

  users: any[] = [];
  insurances: any[] = [];

  constructor(
    private customerService: CustomerService,
    private insuranceService: InsuranceService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.customerService.getCustomers().subscribe((users) => {
      this.users = users.map((user) => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName} (${user.username})`,
      }));
      this.initializeUserControl();
    });

    this.insuranceService.getInsurances().subscribe((insurances) => {
      this.insurances = insurances.map((insurance) => ({
        id: insurance.id,
        name: `${insurance.insuranceType} (${insurance.description})`,
      }));
      this.initializeInsuranceControl();
    });

    if (this.isEditMode) {
      const selectedUser = this.users.find(
        (user) => user.id === this.formGroup.get('userId')?.value
      );
      const selectedInsurance = this.insurances.find(
        (insurance) => insurance.id === this.formGroup.get('insuranceId')?.value
      );

      this.userControl.setValue(selectedUser ? selectedUser.name : '');
      this.insuranceControl.setValue(
        selectedInsurance ? selectedInsurance.name : ''
      );

      // Disable the controls in edit mode
      this.userControl.disable();
      this.insuranceControl.disable();
    }

    this.userControl.valueChanges.subscribe((value) => {
      const selectedUser = this.users.find((user) => user.name === value);
      this.formGroup.patchValue({
        userId: selectedUser ? selectedUser.id : null,
      });
    });

    this.insuranceControl.valueChanges.subscribe((value) => {
      const selectedInsurance = this.insurances.find(
        (insurance) => insurance.name === value
      );
      this.formGroup.patchValue({
        insuranceId: selectedInsurance ? selectedInsurance.id : null,
      });
    });
    this.userControl.valueChanges.subscribe((value) => {
      const selectedUser = this.users.find((user) => user.name === value);
      this.formGroup.patchValue({
        userId: selectedUser ? selectedUser.id : null,
      });
    });

    this.insuranceControl.valueChanges.subscribe((value) => {
      const selectedInsurance = this.insurances.find(
        (insurance) => insurance.name === value
      );
      this.formGroup.patchValue({
        insuranceId: selectedInsurance ? selectedInsurance.id : null,
      });
    });
  }

  onCancel(): void {
    this.dialog.closeAll();
  }

  private initializeUserControl() {
    this.filteredUsers = this.userControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterUsers(value || ''))
    );
  }

  private initializeInsuranceControl() {
    this.filteredInsurances = this.insuranceControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterInsurances(value || ''))
    );
  }

  private _filterUsers(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.users.filter((user) =>
      user.name.toLowerCase().includes(filterValue)
    );
  }

  private _filterInsurances(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.insurances.filter((insurance) =>
      insurance.name.toLowerCase().includes(filterValue)
    );
  }
}
