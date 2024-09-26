import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PolicyService } from './policy.service';
import { Policy } from '../model/policy.model';

describe('PolicyService', () => {
  let service: PolicyService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8080/policies';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PolicyService]
    });
    service = TestBed.inject(PolicyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all policies', () => {
    const mockPolicies: Policy[] = [
      { id: 1, startDate: '2023-01-01', endDate: '2023-12-31', totalAmount: 1000, coverageDetails: 'Full Coverage', userId: 1, insuranceId: 1, policyName: 'Health', username: 'john_doe', insuranceType: 'Health' },
      { id: 2, startDate: '2023-02-01', endDate: '2023-12-31', totalAmount: 1200, coverageDetails: 'Partial Coverage', userId: 2, insuranceId: 2, policyName: 'Car', username: 'jane_doe', insuranceType: 'Car' }
    ];

    service.getAllPolicies().subscribe(policies => {
      expect(policies.length).toBe(2);
      expect(policies).toEqual(mockPolicies);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockPolicies);
  });

  it('should retrieve policies by customer ID', () => {
    const mockPolicies: Policy[] = [
      { id: 1, startDate: '2023-01-01', endDate: '2023-12-31', totalAmount: 1000, coverageDetails: 'Full Coverage', userId: 1, insuranceId: 1, policyName: 'Health', username: 'john_doe', insuranceType: 'Health' }
    ];

    service.getPoliciesByCustomerId(1).subscribe(policies => {
      expect(policies).toEqual(mockPolicies);
    });

    const req = httpMock.expectOne(`${apiUrl}/customer/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPolicies);
  });

  it('should retrieve a policy by ID', () => {
    const mockPolicy: Policy = { id: 1, startDate: '2023-01-01', endDate: '2023-12-31', totalAmount: 1000, coverageDetails: 'Full Coverage', userId: 1, insuranceId: 1, policyName: 'Health', username: 'john_doe', insuranceType: 'Health' };

    service.getPolicyById(1).subscribe(policy => {
      expect(policy).toEqual(mockPolicy);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPolicy);
  });

  it('should create a new policy', () => {
    const newPolicy: Policy = { id: 3, startDate: '2023-05-01', endDate: '2023-12-31', totalAmount: 1500, coverageDetails: 'Comprehensive', userId: 3, insuranceId: 3, policyName: 'Life', username: 'alice', insuranceType: 'Life' };

    service.createPolicy(newPolicy).subscribe(policy => {
      expect(policy).toEqual(newPolicy);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(newPolicy);
  });

  it('should update a policy', () => {
    const updatedPolicy: Policy = { id: 1, startDate: '2023-01-01', endDate: '2023-12-31', totalAmount: 1100, coverageDetails: 'Updated Coverage', userId: 1, insuranceId: 1, policyName: 'Updated Health', username: 'john_doe', insuranceType: 'Health' };

    service.updatePolicy(1, updatedPolicy).subscribe(policy => {
      expect(policy).toEqual(updatedPolicy);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedPolicy);
  });

  it('should delete a policy', () => {
    service.deletePolicy(1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should retrieve user ID by policy ID', () => {
    const mockUserId = 1;

    service.getUserIdByPolicyId(1).subscribe(userId => {
      expect(userId).toBe(mockUserId);
    });

    const req = httpMock.expectOne(`${apiUrl}/user/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUserId);
  });
});