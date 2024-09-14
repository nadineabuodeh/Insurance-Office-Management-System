import { Component, Input, ViewChild } from '@angular/core';

import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { PolicyService } from '../../../service/policy.service';
import { Policy } from '../../../model/policy.model';

import { MatDialogModule, MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule, MatSort } from "@angular/material/sort";
import { MatTableModule, MatTableDataSource } from "@angular/material/table";
import { FormsModule } from '@angular/forms';
import { LoadingService } from '../../../service/loading.service';
import { PolicyFormComponent } from '../../admin-policy/policy-form/policy-form.component';

@Component({
  selector: 'app-customer-policy-layout',
  standalone: true,
  imports: [
    CommonModule, MatSortModule, MatTableModule, FormsModule,
    MatTableModule, DatePipe, CurrencyPipe,
    MatDialogModule, CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSortModule, MatSort],
  templateUrl: './policy-layout.component.html',
  styleUrl: './policy-layout.component.css',
})
export class PolicyLayoutComponent {
  @Input() customerId!: number;
  sortDirection: 'asc' | 'desc' = 'asc';
  selectedColumn: string = 'insuranceType';
  showFilter: boolean = false;

  filterValue: string = '';
  selectedPolicyName: string = '';
  selectedInsuranceType: string = '';
  selectedUserName: string = '';

  displayedColumns: string[] = [
    'startDate',
    'endDate',
    'policyName',
    'totalAmount',
    'coverageDetails',
    'username',
    'insuranceType',
    'actions',
  ];

  columnOptions: string[] = ['policyName', 'insuranceType', 'username', 'totalAmount'];

  dataSource = new MatTableDataSource<Policy>();

  constructor(private policyService: PolicyService, public dialog: MatDialog, private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.loadPolicies();
  }


  toggleFilter() {
    this.showFilter = !this.showFilter;
  }


  get filterIcon(): string {
    return this.dataSource.data.length === 0
      ? './assets/no-filter.png'
      : './assets/filter-icon.png';
  }

  clearFilter() {
    const amountInput = document.querySelector('.filter-input') as HTMLInputElement;
    if (amountInput) {
      amountInput.value = '';
    }
    this.selectedPolicyName = '';
    this.selectedInsuranceType = '';
    this.selectedUserName = ''; this.dataSource.filter = '';
    this.dataSource.filterPredicate = (data: Policy, filter: string) => true;
    this.loadPolicies();
  }



  applyFilter() {
    if (this.selectedColumn === 'policyName') {
      this.dataSource.filterPredicate = (data: Policy, filter: string) => {


        const PolicyNameLower = data.policyName.toLowerCase();
        const filterLower = filter.toLowerCase();

        const result = PolicyNameLower === filterLower || filterLower === '';
        return result;
      };
      this.dataSource.filter = this.selectedPolicyName.trim().toLowerCase();
    } else {
      this.dataSource.filterPredicate = (data: Policy, filter: string) => {


        const dataStr = (data as any)[this.selectedColumn]?.toString().toLowerCase();

        const result = dataStr?.indexOf(filter.toLowerCase()) !== -1;
        return result;
      };
      this.dataSource.filter = this.selectedPolicyName.trim().toLowerCase();
    }


    if (this.selectedColumn === 'username') {
      this.dataSource.filterPredicate = (data: Policy, filter: string) => {


        const userNameLower = data.username.toLowerCase();
        const filterLower = filter.toLowerCase();

        const result = userNameLower === filterLower || filterLower === '';
        return result;
      };
      this.dataSource.filter = this.selectedUserName.trim().toLowerCase();
    } else {
      this.dataSource.filterPredicate = (data: Policy, filter: string) => {


        const dataStr = (data as any)[this.selectedColumn]?.toString().toLowerCase();

        const result = dataStr?.indexOf(filter.toLowerCase()) !== -1;
        return result;
      };
      this.dataSource.filter = this.selectedUserName.trim().toLowerCase();
    }


    if (this.selectedColumn === 'insuranceType') {
      this.dataSource.filterPredicate = (data: Policy, filter: string) => {


        const insuranceTypeLower = data.insuranceType.toLowerCase();
        const filterLower = filter.toLowerCase();

        const result = insuranceTypeLower === filterLower || filterLower === '';
        return result;
      };
      this.dataSource.filter = this.selectedInsuranceType.trim().toLowerCase();
    } else {
      this.dataSource.filterPredicate = (data: Policy, filter: string) => {


        const dataStr = (data as any)[this.selectedColumn]?.toString().toLowerCase();

        const result = dataStr?.indexOf(filter.toLowerCase()) !== -1;
        return result;
      };
      this.dataSource.filter = this.selectedInsuranceType.trim().toLowerCase();
    }


  }



  AmountFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    const filterValue = input ? input.value : '';

    this.dataSource.filterPredicate = (data: Policy, filter: string) => {
      const columnValue = data[this.selectedColumn as keyof Policy];
      return columnValue?.toString().toLowerCase().includes(filter.toLowerCase()) || false;
    };

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  loadPolicies(): void {
    this.policyService.getPoliciesByCustomerId(this.customerId).subscribe(
      (policies) => {
        this.dataSource.data = policies;
      },
      (error) => {
        console.error('Error loading policies:', error);
        this.dataSource.data = [];
      }
    );
  }



  editPolicy(policy: Policy): void {
    const dialogRef = this.dialog.open(PolicyFormComponent, {
      panelClass: 'custom-dialog-container',
      data: { policy },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadPolicies(); // Reload policies after editing
      }
    });
  }

  deletePolicy(id: number): void {
    if (confirm('Are you sure you want to delete this policy?')) {
      this.loadingService.loadingOn();
      this.policyService.deletePolicy(id).subscribe(() => {
        this.loadingService.loadingOff();
        this.loadPolicies(); // Reload policies after deleting
      });
    }
  }

  sortData(column: string): void {
    const data = this.dataSource.data.slice();
    const isAsc = this.sortDirection === 'asc';
    this.sortDirection = isAsc ? 'desc' : 'asc';
    this.dataSource.data = data.sort((a, b) => {
      switch (column) {
        case 'startDate':
          return compare(a.startDate, b.startDate, isAsc);
        case 'endDate':
          return compare(a.endDate, b.endDate, isAsc);
        case 'policyName':
          return compare(a.policyName, b.policyName, isAsc);
        case 'totalAmount':
          return compare(a.totalAmount, b.totalAmount, isAsc);
        case 'coverageDetails':
          return compare(a.coverageDetails, b.coverageDetails, isAsc);
        case 'username':
          return compare(a.username, b.username, isAsc);
        case 'insuranceType':
          return compare(a.insuranceType, b.insuranceType, isAsc);
        default:
          return 0;
      }
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}