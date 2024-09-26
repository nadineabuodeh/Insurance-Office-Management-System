import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomerInfoComponent } from './customer-details.component';
import { CustomerService } from '../../service/CustomerService/customer.service';
import { of } from 'rxjs';
import { Customer } from '../../service/CustomerService/customer.service';

describe('CustomerInfoComponent', () => {
  let component: CustomerInfoComponent;
  let fixture: ComponentFixture<CustomerInfoComponent>;
  let customerService: jasmine.SpyObj<CustomerService>;

  beforeEach(async () => {
    const customerServiceSpy = jasmine.createSpyObj('CustomerService', ['getCustomerInfo']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CustomerInfoComponent],
      providers: [{ provide: CustomerService, useValue: customerServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerInfoComponent);
    component = fixture.componentInstance;
    customerService = TestBed.inject(CustomerService) as jasmine.SpyObj<CustomerService>;

    customerService.getCustomerInfo.and.returnValue(of({
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      phoneNumber: '1234567890',
      idNumber: 'A123456789',
      birthDate: new Date('1990-01-01'),
      role: 'ROLE_CUSTOMER',
    } as Customer));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display customer details', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('John');
    expect(compiled.textContent).toContain('Doe');
    expect(compiled.textContent).toContain('johndoe');
    expect(compiled.textContent).toContain('johndoe@example.com');
  });

  it('should call getCustomerInfo once', () => {
    expect(customerService.getCustomerInfo).toHaveBeenCalledTimes(1);
  });
});