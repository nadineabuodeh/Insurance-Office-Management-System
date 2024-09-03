import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-customer-form-fields',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './customer-form-fields.component.html',
  styleUrls: ['./customer-form-fields.component.css'],
})
export class CustomerFormFieldsComponent {
  @Input() formGroup!: FormGroup;
  @Input() isEditMode: boolean = false;
  @Input() customerName: string = '';

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

        this.formGroup.reset();
        this.dialog.closeAll();
      }
    } else {
      this.formGroup.reset();
      this.dialog.closeAll();
    }
  }
}
