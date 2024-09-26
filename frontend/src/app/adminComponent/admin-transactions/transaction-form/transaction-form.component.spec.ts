import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { TransactionFormComponent } from './transaction-form.component';
import { TransactionService } from '../../../service/TransactionService/transaction.service';
import { LoadingService } from '../../../service/loading.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TransactionFormComponent', () => {
  let component: TransactionFormComponent;
  let fixture: ComponentFixture<TransactionFormComponent>;
  let mockTransactionService: jasmine.SpyObj<TransactionService>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<TransactionFormComponent>>;

  const mockTransaction = {
    id: 1,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    amount: 1000,
    transactionType: 'Payment',
    userId: 1,
    policyId: 1,
  };

  beforeEach(async () => {
    mockTransactionService = jasmine.createSpyObj('TransactionService', ['createTransaction', 'updateTransaction']);
    mockLoadingService = jasmine.createSpyObj('LoadingService', ['loadingOn', 'loadingOff']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        TransactionFormComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { transaction: mockTransaction } },
        { provide: TransactionService, useValue: mockTransactionService },
        { provide: LoadingService, useValue: mockLoadingService }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionFormComponent);
    component = fixture.componentInstance;

    mockTransactionService.createTransaction.and.returnValue(of(mockTransaction));
    mockTransactionService.updateTransaction.and.returnValue(of(mockTransaction));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog on cancel', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should create a new transaction', () => {
    component.isEditMode = false;
    component.onSubmit();
    expect(mockTransactionService.createTransaction).toHaveBeenCalled();
  });

  it('should update an existing transaction', () => {
    component.isEditMode = true;
    component.onSubmit();
    expect(mockTransactionService.updateTransaction).toHaveBeenCalled();
  });
});