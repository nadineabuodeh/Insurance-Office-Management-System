import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { PolicyService } from '../../service/policy.service';
import { Policy } from '../../model/policy.model';

@Component({
  selector: 'app-policy-layout',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './policy-layout.component.html',
  styleUrl: './policy-layout.component.css',
})
export class PolicyCustomerComponent {
  displayedColumns: string[] = [
    'startDate',
    'endDate',
    'policyName',
    'totalAmount',
    'coverageDetails',
    'insuranceType'
  ];  
  dataSource = new MatTableDataSource<Policy>();

  constructor(private policyService: PolicyService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadPolicies();
  }

  loadPolicies(): void {
    this.policyService.getPoliciesForCustomer().subscribe({
      next: (policies: Policy[]) => {
        this.dataSource.data = policies;
        console.log('Policies loaded:', policies);
      },
    });
  }
  
}
