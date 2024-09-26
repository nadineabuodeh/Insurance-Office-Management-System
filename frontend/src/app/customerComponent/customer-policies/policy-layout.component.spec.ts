import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PolicyCustomerComponent } from './policy-layout.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PolicyService } from '../../service/policy.service';
import { of } from 'rxjs';

describe('PolicyCustomerComponent', () => {
  let component: PolicyCustomerComponent;
  let fixture: ComponentFixture<PolicyCustomerComponent>;
  let policyService: PolicyService;

  const policiesMock = [
    {
      id: 1,
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      totalAmount: 1200,
      coverageDetails: 'Full Coverage',
      userId: 1,
      insuranceId: 1,
      policyName: 'Health Insurance',
      username: 'JohnDoe',
      insuranceType: 'Health'
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyCustomerComponent, HttpClientTestingModule],
      providers: [PolicyService],
    }).compileComponents();

    fixture = TestBed.createComponent(PolicyCustomerComponent);
    component = fixture.componentInstance;
    policyService = TestBed.inject(PolicyService);

    spyOn(policyService, 'getPoliciesForCustomer').and.returnValue(of(policiesMock));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load policies on init', () => {
    expect(component.dataSource.data).toEqual(policiesMock);
  });
});