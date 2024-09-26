import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { PolicyFormComponent } from './policy-form.component';
import { PolicyService } from '../../../service/policy.service';
import { LoadingService } from '../../../service/loading.service';
import { Policy } from '../../../model/policy.model';

describe('PolicyFormComponent', () => {
  let component: PolicyFormComponent;
  let fixture: ComponentFixture<PolicyFormComponent>;
  let mockPolicyService: jasmine.SpyObj<PolicyService>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<PolicyFormComponent>>;

  const mockPolicy: Policy = {
    id: 1,
    policyName: 'Test Policy',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    totalAmount: 1000,
    coverageDetails: 'Test coverage',
    userId: 1,
    insuranceId: 1,
    insuranceType: 'Health',
    username: 'testuser'
  };

  beforeEach(async () => {
    mockPolicyService = jasmine.createSpyObj('PolicyService', ['getAllPolicies', 'createPolicy', 'updatePolicy']);
    mockLoadingService = jasmine.createSpyObj('LoadingService', ['loadingOn', 'loadingOff']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        PolicyFormComponent
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { policy: mockPolicy } },
        { provide: PolicyService, useValue: mockPolicyService },
        { provide: LoadingService, useValue: mockLoadingService }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PolicyFormComponent);
    component = fixture.componentInstance;

    mockPolicyService.getAllPolicies.and.returnValue(of([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog on cancel', () => {
    component['dialogRef'].close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});