import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable, startWith, map } from 'rxjs';
import {
  Customer,
  CustomerService,
} from '../../../service/CustomerService/customer.service';
import { PolicyService } from '../../../service/policy.service';
import { Policy } from '../../../model/policy.model';
import { TransactionService } from '../../../service/TransactionService/transaction.service';
@Component({
  selector: 'app-transaction-form-fields',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatButtonModule,
    MatDialogModule,
    MatOptionModule,
    MatSelectModule,
    MatAutocompleteModule,
  ],
  templateUrl: './transaction-form-fields.component.html',
  styleUrls: ['./transaction-form-fields.component.css'],
})
export class TransactionFormFieldsComponent {
  @Input() formGroup!: FormGroup;
  @Input() isEditMode: boolean = false;
  @Input() customerName: string = '';

  userControl = new FormControl<Customer | null>(null);
  users$: Observable<Customer[]> | undefined;
  private users: Customer[] = [];
  private usersLoaded: boolean = false;

  policyNameControl = new FormControl('');
  policies: Policy[] = [];
  filteredPolicies: Observable<Policy[]> | undefined;
  private policiesLoaded: boolean = false;

  transactionTypes: string[] = ['DEPOSIT', 'DEBT'];

  private initialFormValue: any;

  constructor(private dialog: MatDialog, private customerService: CustomerService, private policyService: PolicyService, private transactionService: TransactionService
  ) { }

  // ngOnInit(): void {
  //   this.initialFormValue = this.formGroup.getRawValue();
  //   this.loadUsers(); this.loadPolicies();
  // }
   
  // constructor(
  //   private dialog: MatDialog,
  //   private customerService: CustomerService,
  //   private policyService: PolicyService
  // ) {}

  ngOnInit(): void {
    this.initialFormValue = this.formGroup.getRawValue();
    this.loadUsers();
    this.loadPolicies();
  

    this.users$ = this.userControl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterUsers(value))
    );

    this.filteredPolicies = this.policyNameControl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterPolicies(value ?? ''))
    );

  }

  private filterPolicies(value: any): Policy[] {
    const filterValue = (typeof value === 'string' ? value : '').toLowerCase();

    return this.policies.filter((policy) => {
      const policyName = policy.policyName ?? '';
      return policyName.toLowerCase().includes(filterValue);
    });
  }


onPolicySelected(event: MatAutocompleteSelectedEvent): void {
    const selectedPolicy = event.option.value as Policy;
    this.policyNameControl.setValue(event.option.value);
    this.policyNameControl.setValue(selectedPolicy.policyName);
    this.formGroup.patchValue({
      policyId: selectedPolicy.id
    });

    this.policyService.getUserIdByPolicyId(selectedPolicy.id).subscribe(userId => {
      console.log("user id: " + userId)
      console.log("Selected policy -> " + selectedPolicy.id)
      this.formGroup.patchValue({
        userId: userId
      });

      const user = this.users.find(u => u.id === userId) || null;
      console.log("user ->" + user?.firstName)
      this.userControl.setValue(user, { emitEvent: false });
    }, error => {
      console.error('Error fetching user ID by policy ID:', error);
    });
  }



  displayPolicy(policy: Policy): string {
    return policy ? policy.policyName : '';
  }

  private filterUsers(value: any): Customer[] {
    const filterValue =
      value && typeof value === 'string' ? value.toLowerCase() : '';
    return this.users.filter((user) =>
      user.username.toLowerCase().includes(filterValue)
    );
  }

  displayUser(user: Customer): string {
    return user ? `${user.firstName} ${user.lastName} (${user.username})` : '';
  }

  private loadPolicies(): void {
    this.policyService.getAllPolicies().subscribe({
      next: (policies) => {
        this.policies = policies || [];
        this.policiesLoaded = true;
        this.setInitialValuesIfNeeded();
      },
      error: (error) => {
        this.policies = [];
        this.policiesLoaded = true;
        this.setInitialValuesIfNeeded();
      },
    });
  }
  private loadUsers(): void {
    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        this.users = customers;
        this.usersLoaded = true;
        this.setInitialValuesIfNeeded();
      },
      error: (error) => {
        this.users = [];
        this.usersLoaded = true;
        this.setInitialValuesIfNeeded();
      },
    });
  }

  private setInitialValuesIfNeeded(): void {
    if (this.isEditMode && this.usersLoaded && this.policiesLoaded) {
      const userId = this.formGroup.get('userId')?.value;
      const policyId = this.formGroup.get('policyId')?.value;

      const selectedUser = this.users.find((user) => user.id === userId);
      const selectedPolicy = this.policies.find(
        (policy) => policy.id === policyId
      );

      this.userControl.setValue(selectedUser || null, { emitEvent: false });
      this.policyNameControl.setValue(
        selectedPolicy ? selectedPolicy.policyName : '',
        { emitEvent: false }
      );
    }
  }

  onUserSelection(event: MatAutocompleteSelectedEvent): void {
    const selectedUser = event.option.value as Customer;
    this.formGroup.patchValue({
      userId: selectedUser.id,
    });
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
