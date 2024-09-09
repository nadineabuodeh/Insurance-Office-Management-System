import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InsuranceService } from '../../../service/insurance.service';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Insurance } from '../../../model/insurance.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { InsuranceFormFieldsComponent } from '../insurance-form-fields/insurance-form-fields.component';

@Component({
  selector: 'app-insurance-form',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    InsuranceFormFieldsComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './insurance-form.component.html',
  styleUrls: ['./insurance-form.component.css'],
})
export class InsuranceFormComponent {
  insuranceForm: FormGroup;
  isEditMode: boolean = false;
  insuranceType: string = '';

  constructor(
    private fb: FormBuilder,
    private insuranceService: InsuranceService,
    private dialogRef: MatDialogRef<InsuranceFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.insuranceForm = this.fb.group({
      insuranceType: ['', Validators.required],
      description: ['', Validators.required],
    });

    if (data && data.insurance) {
      this.insuranceForm.patchValue(data.insurance);
      this.isEditMode = true;
    }
  }

  onSubmit(): void {
    if (this.insuranceForm.valid) {
        const insuranceData: Insurance = this.insuranceForm.getRawValue(); // Get form data

        if (this.isEditMode) {
            this.insuranceService.updateInsurance(this.data.insurance.id!, insuranceData).subscribe(
                () => {
                    console.log('Insurance updated successfully');
                    this.dialogRef.close(insuranceData);
                },
                (error) => console.error('Error updating insurance:', error)
            );
        } else {
            this.insuranceService.addInsurance(insuranceData).subscribe(
                (newInsurance) => {
                    console.log('Insurance added successfully:', newInsurance);
                    this.dialogRef.close(newInsurance);
                },
                (error) => console.error('Error adding insurance:', error)
            );
        }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
