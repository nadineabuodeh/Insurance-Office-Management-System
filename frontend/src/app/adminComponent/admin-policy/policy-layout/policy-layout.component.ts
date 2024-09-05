import { Component, ViewChild } from '@angular/core';
import { PolicyFormComponent } from '../policy-form/policy-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { PolicyService } from '../../../service/policy.service';
import { Policy } from '../../../model/policy.model';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-policy-layout',
  standalone: true,
  imports: [CommonModule, MatSortModule, MatTableModule],
  templateUrl: './policy-layout.component.html',
  styleUrl: './policy-layout.component.css',
})
export class PolicyLayoutComponent {
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
  dataSource = new MatTableDataSource<Policy>();
  @ViewChild(MatSort) sort!: MatSort;  // ViewChild for MatSort

  constructor(private policyService: PolicyService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadPolicies();
  }
  ngAfterViewInit() {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    else {
      console.log("policyy sort fails")
    }
  }
  loadPolicies(): void {
    this.policyService.getAllPolicies().subscribe({
      next: (policies: Policy[]) => {
        this.dataSource.data = policies;
      },
    });
  }

  onAddPolicyClick(): void {
    const dialogRef = this.dialog.open(PolicyFormComponent, {
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadPolicies(); // Reload policies after adding
      }
    });
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
      this.policyService.deletePolicy(id).subscribe(() => {
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
    });}

    sortDirection: 'asc' | 'desc' = 'asc';
  }
  
  function compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }


