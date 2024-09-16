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
import { LoadingService } from '../../../service/loading.service';


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
    @Inject(MAT_DIALOG_DATA) public data: any,
    private loadingService: LoadingService
  ) {
    this.policyForm = this.fb.group({
      id: [null],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      policyName: ['', Validators.required],
      totalAmount: ['', [Validators.required, Validators.min(0)]],
      coverageDetails: ['', Validators.required],
      userId: ['', Validators.required],
      insuranceId: ['', Validators.required],
      installmentsEnabled: [false],
      numberOfPayments: [{ value: '', disabled: true }, Validators.required],
    }, {
      validator: endDateAfterStartDateValidator()

    });
    this.dialogRef.disableClose = true;
  }


  ngOnInit() {
    if (this.data && this.data.policy) {
      this.policyForm.patchValue(this.data.policy);
      this.isEditMode = true;

      this.policyForm.get('startDate')?.disable();
      this.policyForm.get('endDate')?.disable();
      this.policyForm.get('totalAmount')?.disable();
      this.policyForm.get('userId')?.disable();
    }

    this.policyService.getAllPolicies().subscribe((policies) => {
      this.existingPolicies = policies;
    });

    this.policyForm.get('installmentsEnabled')?.valueChanges.subscribe(enabled => {
      const numberOfPaymentsControl = this.policyForm.get('numberOfPayments');
      if (enabled) {
        numberOfPaymentsControl?.enable();
      } else {
        numberOfPaymentsControl?.disable();
      }
    });
    
    this.policyForm.patchValue({
      insuranceId: this.data.policy.insuranceId
    });
    
  }


  onSubmit() {
    if (this.policyForm.valid) {
      const policyData: Policy = this.policyForm.value;

      this.loadingService.loadingOn();

      if (this.isEditMode) {
        this.policyService.updatePolicy(policyData.id, policyData)
          .subscribe(() => {
            this.loadingService.loadingOff();
            this.dialogRef.close(policyData);
          });
      } else {
        const isDuplicate = this.existingPolicies.some(
          (policy) => policy.policyName === policyData.policyName
        );

        if (isDuplicate) {
          this.policyForm.get('policyName')?.setErrors({ duplicate: true });
          this.loadingService.loadingOff();
        } else {
          const numberOfPayments = this.policyForm.value.installmentsEnabled ? this.policyForm.value.numberOfPayments : undefined;
          console.log("numberOfPayments->" + numberOfPayments)
          this.policyService.createPolicy(policyData, numberOfPayments)
            .subscribe((createdPolicy) => {
              if (this.policyForm.value.installmentsEnabled) {
                this.policyForm.patchValue({ id: createdPolicy.id });
                console.log("Installment enabled with policy id ->" + createdPolicy.id);
                this.loadingService.loadingOff();
                this.dialogRef.close(createdPolicy);
              } else {
                this.loadingService.loadingOff();
                this.dialogRef.close(createdPolicy);
              }
            }, error => {
              this.loadingService.loadingOff();
              console.error('Error creating policy:', error);
            });
        }
      }
    }
  }


}