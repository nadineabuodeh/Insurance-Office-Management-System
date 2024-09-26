import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CustomerDetailsComponent } from './customer-details.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { CustomerService } from '../../../service/CustomerService/customer.service';
import { LoadingService } from '../../../service/loading.service';
import { Location } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CustomerDetailsComponent', () => {
  let component: CustomerDetailsComponent;
  let fixture: ComponentFixture<CustomerDetailsComponent>;
  let customerServiceSpy: jasmine.SpyObj<CustomerService>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let locationSpy: jasmine.SpyObj<Location>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    const customerService = jasmine.createSpyObj('CustomerService', ['getCustomerById', 'deleteCustomer', 'updateCustomer']);
    const loadingService = jasmine.createSpyObj('LoadingService', ['loadingOn', 'loadingOff']);
    const location = jasmine.createSpyObj('Location', ['back']);
    const dialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        CustomerDetailsComponent, 
        HttpClientTestingModule, 
        NoopAnimationsModule
      ],
      providers: [
        { provide: CustomerService, useValue: customerService },
        { provide: LoadingService, useValue: loadingService },
        { provide: Location, useValue: location },
        { provide: MatDialog, useValue: dialog },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: () => '1' })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerDetailsComponent);
    component = fixture.componentInstance;
    customerServiceSpy = TestBed.inject(CustomerService) as jasmine.SpyObj<CustomerService>;
    loadingServiceSpy = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
    locationSpy = TestBed.inject(Location) as jasmine.SpyObj<Location>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    customerServiceSpy.getCustomerById.and.returnValue(of({
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      username: 'john.doe',
      idNumber: '123456',
      phoneNumber: '555-5555',
      email: 'john.doe@example.com',
      birthDate: new Date('1990-01-01'),
      role: 'ROLE_CUSTOMER',
    }));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load customer details on init', () => {
    expect(component.customer).toBeTruthy();
    expect(component.customer?.firstName).toEqual('John');
  });

  it('should delete customer and navigate back', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    customerServiceSpy.deleteCustomer.and.returnValue(of(undefined));

    component.deleteCustomer(1);

    expect(loadingServiceSpy.loadingOn).toHaveBeenCalled();
    expect(customerServiceSpy.deleteCustomer).toHaveBeenCalledWith(1);
    expect(loadingServiceSpy.loadingOff).toHaveBeenCalled();
    expect(locationSpy.back).toHaveBeenCalled();
  });

  it('should not delete customer if not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteCustomer(1);

    expect(customerServiceSpy.deleteCustomer).not.toHaveBeenCalled();
  });
});