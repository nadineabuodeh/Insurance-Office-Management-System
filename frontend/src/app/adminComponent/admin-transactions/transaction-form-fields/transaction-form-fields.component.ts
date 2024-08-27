import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOption, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-transaction-form-fields',
  standalone: true,
  imports: [CommonModule,
    MatFormFieldModule,
    MatInputModule, ReactiveFormsModule,
    MatDatepickerModule,MatFormFieldModule,
    MatButtonModule, MatDialogModule,MatOption ,
    MatSelectModule,
    MatOptionModule,],
  templateUrl: './transaction-form-fields.component.html',
  styleUrl: './transaction-form-fields.component.css'
})
export class TransactionFormFieldsComponent {
  @Input() formGroup!: FormGroup;
  @Input() isEditMode: boolean = false;
  @Input() customerName: string = '';

  transactionTypes: string[] = ['DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'DEBT']; 

  private initialFormValue: any;

  constructor(private dialog: MatDialog) { }

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
