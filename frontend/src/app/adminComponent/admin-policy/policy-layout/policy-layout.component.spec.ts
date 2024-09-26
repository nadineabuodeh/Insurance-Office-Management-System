import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PolicyLayoutComponent } from './policy-layout.component';
import { PolicyService } from '../../../service/policy.service';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PolicyLayoutComponent', () => {
  let component: PolicyLayoutComponent;
  let fixture: ComponentFixture<PolicyLayoutComponent>;
  let mockPolicyService: jasmine.SpyObj<PolicyService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<PolicyLayoutComponent>>;

  const mockPolicies = [
    {
      id: 1,
      policyName: 'Policy 1',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      totalAmount: 1000,
      coverageDetails: 'Coverage 1',
      userId: 1,
      insuranceId: 1,
      username: 'User 1',
      insuranceType: 'Health'
    },
    {
      id: 2,
      policyName: 'Policy 2',
      startDate: '2024-02-01',
      endDate: '2024-11-30',
      totalAmount: 2000,
      coverageDetails: 'Coverage 2',
      userId: 2,
      insuranceId: 2,
      username: 'User 2',
      insuranceType: 'Vehicle'
    }
  ];

  beforeEach(async () => {
    mockPolicyService = jasmine.createSpyObj('PolicyService', ['getAllPolicies', 'deletePolicy']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        PolicyLayoutComponent,
        HttpClientTestingModule,
        MatDialogModule,
        MatTableModule,
        MatSortModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: PolicyService, useValue: mockPolicyService },
        { provide: MatDialogRef, useValue: mockDialogRef }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PolicyLayoutComponent);
    component = fixture.componentInstance;

    mockPolicyService.getAllPolicies.and.returnValue(of(mockPolicies));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load policies on init', () => {
    component.loadPolicies();
    expect(mockPolicyService.getAllPolicies).toHaveBeenCalled();
    expect(component.dataSource.data.length).toBe(2);
  });

  it('should delete a policy', () => {
    spyOn(window, 'confirm').and.returnValue(true); 
    mockPolicyService.deletePolicy.and.returnValue(of(void 0));

    component.deletePolicy(1);
    expect(mockPolicyService.deletePolicy).toHaveBeenCalledWith(1);
  });
});