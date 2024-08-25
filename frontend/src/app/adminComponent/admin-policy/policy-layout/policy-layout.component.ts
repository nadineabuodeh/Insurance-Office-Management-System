import { Component } from '@angular/core';
import { PolicyFormComponent } from '../policy-form/policy-form.component';
import { Policy, PolicyService } from '../../../service/policy.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-policy-layout',
  standalone: true,
  imports: [CommonModule, 
    MatTableModule
  ],
  templateUrl: './policy-layout.component.html',
  styleUrl: './policy-layout.component.css'
})
export class PolicyLayoutComponent {
  displayedColumns: string[] = ['startDate', 'endDate', 'totalAmount', 'coverageDetails', 'userId', 'insuranceId', 'actions'];
  dataSource = new MatTableDataSource<Policy>();

  constructor(private policyService: PolicyService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadPolicies();
  }

  loadPolicies(): void {
    this.dataSource.data = this.policyService.getPolicies();
  }

  onAddPolicyClick(): void {
    const dialogRef = this.dialog.open(PolicyFormComponent, {
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.policyService.addPolicy(result);
        this.loadPolicies();
      }
    });
  }

  editPolicy(policy: Policy): void {
    const dialogRef = this.dialog.open(PolicyFormComponent, {
      panelClass: 'custom-dialog-container',
      data: { policy }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.policyService.updatePolicy(policy.id, result);
        this.loadPolicies();
      }
    });
  }

  deletePolicy(id: number): void {
    if (confirm('Are you sure you want to delete this policy?')) {
      this.policyService.deletePolicy(id);
      this.loadPolicies();
    }
  }
}
