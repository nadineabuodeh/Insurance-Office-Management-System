import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CustomerService } from '../../../service/CustomerService/customer.service';
import { LoadingService } from '../../../service/loading.service';
import { of } from 'rxjs';
import { CustomerFormComponent } from './customer-form.component';

describe('CustomerFormComponent', () => {
  let component: CustomerFormComponent;
  let fixture: ComponentFixture<CustomerFormComponent>;
  let mockCustomerService: jasmine.SpyObj<CustomerService>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<CustomerFormComponent>>;

  beforeEach(async () => {
    mockCustomerService = jasmine.createSpyObj('CustomerService', ['getCustomers', 'addCustomer', 'updateCustomer']);
    mockLoadingService = jasmine.createSpyObj('LoadingService', ['loadingOn', 'loadingOff']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    mockCustomerService.getCustomers.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        CustomerFormComponent,
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: CustomerService, useValue: mockCustomerService },
        { provide: LoadingService, useValue: mockLoadingService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.customerForm).toBeDefined();
    expect(component.customerForm.get('firstName')?.value).toBe('');
    expect(component.customerForm.get('lastName')?.value).toBe('');
    expect(component.customerForm.get('email')?.value).toBe('');
  });

  it('should not submit form if invalid', () => {
    spyOn(component, 'onSubmit').and.callThrough();
    component.onSubmit();
    expect(component.onSubmit).toHaveBeenCalled();
    expect(mockCustomerService.addCustomer).not.toHaveBeenCalled();
  });

  it('should submit form and call service to add customer if valid', () => {
    const mockCustomerData = {
      id: 0,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '1234567890',
      idNumber: '123456789',
      username: 'johndoe',
      birthDate: new Date('1990-01-01'),
      role: 'ROLE_CUSTOMER'
    };    
    
    component.customerForm.patchValue(mockCustomerData);
    expect(component.customerForm.valid).toBeTruthy();

    mockCustomerService.addCustomer.and.returnValue(of(mockCustomerData));
    
    component.onSubmit();
    expect(mockLoadingService.loadingOn).toHaveBeenCalled();
    expect(mockCustomerService.addCustomer).toHaveBeenCalledWith(mockCustomerData);
    expect(mockDialogRef.close).toHaveBeenCalledWith(mockCustomerData);
    expect(mockLoadingService.loadingOff).toHaveBeenCalled();
  });
});