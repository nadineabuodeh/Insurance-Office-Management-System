import { CommonModule } from '@angular/common';
import { TransactionService, Transaction } from '../../../service/TransactionService/transaction.service';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { TransactionFormFieldsComponent } from '../transaction-form-fields/transaction-form-fields.component';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,MatFormFieldModule,
    MatNativeDateModule,TransactionFormFieldsComponent],
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css']
})
export class TransactionFormComponent {
  transactionForm: FormGroup;  
  isEditMode: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private dialogRef: MatDialogRef<TransactionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.transactionForm = this.fb.group({  
      id: [null],
      startDate: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
      endDate: ['', Validators.required],
      transactionType: ['', Validators.required], 
      userId: [null, Validators.required],
      policyId: [null, Validators.required],
    });

    if (this.data && this.data.transaction) {
      this.isEditMode = true;
      this.transactionForm.patchValue(this.data.transaction);
    }
    this.dialogRef.disableClose = true;
  }



  ngOnInit() {
    if (this.isEditMode) {
      this.transactionForm.patchValue(this.data.transaction);
    }
    
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      const transactionData: Transaction = this.transactionForm.value;

      if (this.isEditMode) {
        this.updateTransaction(transactionData);
      } else {
        this.createTransaction(transactionData);
      }
    }
  }

  createTransaction(transaction: Transaction) {
    this.subscription.add(
      this.transactionService.createTransaction(transaction).subscribe({
        next: (response) => {
          console.log('Transaction created:', response);
          this.dialogRef.close(response); 
        },
        error: (error) => {
          console.error('Error creating transaction:', error);
        }
      })
    );
  }

  updateTransaction(transaction: Transaction) {
    this.subscription.add(
      this.transactionService.updateTransaction(transaction.id, transaction).subscribe({
        next: (response) => {
          console.log('Transaction updated:', response);
          this.dialogRef.close(response); 
        },
        error: (error) => {
          console.error('Error updating transaction:', error);
        }
      })
    );
  }

  onCancel() {
    this.dialogRef.close();
  }
}
