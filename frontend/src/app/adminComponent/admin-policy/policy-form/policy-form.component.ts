import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PolicyService } from '../../../service/policy.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PolicyFormFieldsComponent } from '../policy-form-fields/policy-form-fields.component';
import { Policy } from '../../../model/policy.model';
import { Observable, switchMap, catchError, map, of, take, tap } from 'rxjs';
import { endDateAfterStartDateValidator } from '../../../validators/date-validator';


@Component({
  selector: 'app-policy-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    PolicyFormFieldsComponent,
  ],
  templateUrl: './policy-form.component.html',
  styleUrl: './policy-form.component.css',
})
export class PolicyFormComponent implements OnInit {
  policyForm: FormGroup;
  isEditMode: boolean = false;
  existingPolicies: Policy[] = [];

  constructor(
    private fb: FormBuilder,
    private policyService: PolicyService,
    private dialogRef: MatDialogRef<PolicyFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.policyForm = this.fb.group({
      id: [null],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      policyName: ['', Validators.required],
      totalAmount: ['', [Validators.required, Validators.min(0)]],
      coverageDetails: ['', Validators.required],
      userId: ['', Validators.required],
      insuranceId: ['', Validators.required]
    // });
    }, {
      validator: endDateAfterStartDateValidator() 
      insuranceId: ['', Validators.required],
    });


    this.dialogRef.disableClose = true;
  }

  ngOnInit() {
    if (this.data && this.data.policy) {
      this.policyForm.patchValue(this.data.policy);
      this.isEditMode = true;
    }

    this.policyService.getAllPolicies().subscribe((policies) => {
      this.existingPolicies = policies;
    });
  }

  onSubmit() {
    if (this.policyForm.valid) {
      const policyData: Policy = this.policyForm.value;

      if (this.isEditMode) {
        this.policyService
          .updatePolicy(policyData.id, policyData)
          .subscribe(() => {
            this.dialogRef.close(policyData);
          });
      } else {
        const isDuplicate = this.existingPolicies.some(
          (policy) => policy.policyName === policyData.policyName
        );

        if (isDuplicate) {
          this.policyForm.get('policyName')?.setErrors({ duplicate: true });
        } else {
          this.policyService
            .createPolicy(policyData)
            .subscribe((createdPolicy) => {
              this.dialogRef.close(createdPolicy);
            });
        }
      }
    }
  }
}
