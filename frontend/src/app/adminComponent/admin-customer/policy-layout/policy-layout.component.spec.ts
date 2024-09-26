import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PolicyLayoutCustomerComponent } from './policy-layout.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { PolicyService } from '../../../service/policy.service';
import { of } from 'rxjs';
import { Policy } from '../../../model/policy.model';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PolicyLayoutCustomerComponent', () => {
  let component: PolicyLayoutCustomerComponent;
  let fixture: ComponentFixture<PolicyLayoutCustomerComponent>;
  let mockPolicyService: jasmine.SpyObj<PolicyService>;

  const mockPolicies: Policy[] = [
    {
      id: 1,
      policyName: 'Health Insurance',
      totalAmount: 1000,
      coverageDetails: 'Basic Coverage',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      username: 'johndoe',
      insuranceType: 'HEALTH',
      userId: 0,
      insuranceId: 0
    },
    {
      id: 2,
      policyName: 'Car Insurance',
      totalAmount: 2000,
      coverageDetails: 'Full Coverage',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      username: 'janesmith',
      insuranceType: 'VEHICLE',
      userId: 0,
      insuranceId: 0
    },
  ];

  beforeEach(async () => {
    mockPolicyService = jasmine.createSpyObj('PolicyService', ['getPoliciesByCustomerId']);
    mockPolicyService.getPoliciesByCustomerId.and.returnValue(of(mockPolicies));

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, MatTableModule, FormsModule, PolicyLayoutCustomerComponent, NoopAnimationsModule],
      providers: [{ provide: PolicyService, useValue: mockPolicyService }],
    }).compileComponents();

    fixture = TestBed.createComponent(PolicyLayoutCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load policies on init', () => {
    component.customerId = 1;
    component.ngOnInit();
    expect(mockPolicyService.getPoliciesByCustomerId).toHaveBeenCalledWith(1);
    expect(component.dataSource.data.length).toBe(2);
    expect(component.dataSource.data[0].policyName).toBe('Health Insurance');
  });

  it('should show "No Policies" message when no policies are available', () => {
    mockPolicyService.getPoliciesByCustomerId.and.returnValue(of([]));
    component.loadPolicies();
    fixture.detectChanges();
    expect(component.dataSource.data.length).toBe(0);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-text')?.textContent).toContain('There Are No Policies for this Customer!');
  });
});