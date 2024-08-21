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

@Component({
  selector: 'app-policy-form-fields',
  standalone: true,
  imports: [CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatButtonModule,
    MatDialogModule ,
    MatAutocompleteModule, 
    MatOptionModule],
  templateUrl: './policy-form-fields.component.html',
  styleUrl: './policy-form-fields.component.css'
})
export class PolicyFormFieldsComponent {
  @Input() formGroup!: FormGroup;
  @Input() isEditMode: boolean = false;

  userControl = new FormControl('');
  insuranceControl = new FormControl('');

  filteredUsers!: Observable<any[]>;
  filteredInsurances!: Observable<any[]>;

  users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Michael Johnson' }
  ];

  insurances = [
    { id: 101, name: 'Health Insurance' },
    { id: 102, name: 'Car Insurance' },
    { id: 103, name: 'Life Insurance' }
  ];

  private initialFormValue: any;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.initialFormValue = this.formGroup.getRawValue();

    this.filteredUsers = this.userControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterUsers(value || ''))
    );

    this.filteredInsurances = this.insuranceControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterInsurances(value || ''))
    );

    if (this.isEditMode) {
      const selectedUser = this.users.find(user => user.id === this.formGroup.get('userId')?.value);
      const selectedInsurance = this.insurances.find(insurance => insurance.id === this.formGroup.get('insuranceId')?.value);

      this.userControl.setValue(selectedUser ? selectedUser.name : '');
      this.insuranceControl.setValue(selectedInsurance ? selectedInsurance.name : '');
    }

    // Update formGroup with selected user and insurance IDs
    this.userControl.valueChanges.subscribe(value => {
      const selectedUser = this.users.find(user => user.name === value);
      this.formGroup.patchValue({ userId: selectedUser ? selectedUser.id : null });
    });

    this.insuranceControl.valueChanges.subscribe(value => {
      const selectedInsurance = this.insurances.find(insurance => insurance.name === value);
      this.formGroup.patchValue({ insuranceId: selectedInsurance ? selectedInsurance.id : null });
    });
  }

  private _filterUsers(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.users.filter(user => user.name.toLowerCase().includes(filterValue));
  }

  private _filterInsurances(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.insurances.filter(insurance => insurance.name.toLowerCase().includes(filterValue));
  }

  onCancel(): void {
    if (this.formGroup.dirty) {
      if (confirm('Are you sure you want to discard your changes?')) {
        this.formGroup.patchValue(this.initialFormValue);
        this.formGroup.markAsPristine();
        this.dialog.closeAll();
      }
    } else {
      this.dialog.closeAll();
    }
  }
}
