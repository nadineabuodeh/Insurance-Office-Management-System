import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-insurance-form-fields',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './insurance-form-fields.component.html',
  styleUrl: './insurance-form-fields.component.css',
})
export class InsuranceFormFieldsComponent {
  @Input() formGroup!: FormGroup;
  @Input() isEditMode: boolean = false;
  @Input() insuranceType: string = '';

  insuranceTypes: string[] = ['HEALTH', 'VEHICLE', 'HOME', 'LIFE'];

  private initialFormValue: any;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.initialFormValue = this.formGroup.getRawValue();
  }

  onCancel(): void {
    if (this.formGroup.dirty) {
      if (confirm('Are you sure you want to discard your changes?')) {
        this.formGroup.patchValue(this.initialFormValue);
        this.formGroup.markAsPristine();
        this.formGroup.markAsUntouched();
        this.dialog.closeAll();
      }
    } else {
      this.formGroup.reset();
      this.dialog.closeAll();
    }
  }
}
