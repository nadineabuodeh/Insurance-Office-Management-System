import { Component } from '@angular/core';
import { PolicyFormComponent } from '../policy-form/policy-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { PolicyService } from '../../../service/policy.service';
import { Policy } from '../../../model/policy.model';

@Component({
  selector: 'app-policy-layout',
  standalone: true,
  imports: [CommonModule, MatTableModule],
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

  constructor(private policyService: PolicyService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadPolicies();
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
}
