import { Component, Input, SimpleChanges } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { PolicyService } from '../../../service/policy.service';
import { Policy } from '../../../model/policy.model';

@Component({
  selector: 'app-customer-policy-layout',
  standalone: true,
  imports: [CommonModule, 
    MatTableModule
  ],
  templateUrl: './policy-layout.component.html',
  styleUrl: './policy-layout.component.css'
})
export class PolicyLayoutComponent {
  @Input() customerId!: number;
  displayedColumns: string[] = ['startDate', 'endDate', 'totalAmount', 'coverageDetails', 'insuranceDescription'];
  dataSource = new MatTableDataSource<Policy>();

  constructor(private policyService: PolicyService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customerId'] && this.customerId) {
      this.dataSource.data = [];
      this.loadPolicies();
    }
  }

  loadPolicies(): void {
    this.policyService.getPoliciesByCustomerId(this.customerId).subscribe(policies => {
      this.dataSource.data = policies;
    }, error => {
      console.error('Error loading policies:', error);
      this.dataSource.data = [];
    });
  }
}