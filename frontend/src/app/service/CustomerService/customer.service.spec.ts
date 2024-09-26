import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CustomerService, Customer } from './customer.service';
import { AuthService } from '../auth.service';

describe('CustomerService', () => {
  let service: CustomerService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let mockToken = 'test-token';
  let baseUrl = 'http://localhost:8080/users';

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CustomerService,
        { provide: AuthService, useValue: spy }
      ]
    });

    service = TestBed.inject(CustomerService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    // Mock token
    localStorage.setItem('authToken', mockToken);
  });

  afterEach(() => {
    localStorage.removeItem('authToken');
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve customers and filter by role', () => {
    const mockCustomers: Customer[] = [
      { id: 1, firstName: 'John', lastName: 'Doe', birthDate: new Date(), username: 'johndoe', email: 'john@example.com', phoneNumber: '1234567890', idNumber: '12345', role: 'ROLE_CUSTOMER' },
      { id: 2, firstName: 'Jane', lastName: 'Smith', birthDate: new Date(), username: 'janesmith', email: 'jane@example.com', phoneNumber: '0987654321', idNumber: '67890', role: 'ROLE_ADMIN' }
    ];

    service.getCustomers().subscribe(customers => {
      expect(customers.length).toBe(1);
      expect(customers[0].role).toEqual('ROLE_CUSTOMER');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush(mockCustomers);
  });

  it('should retrieve a customer by id', () => {
    const mockCustomer: Customer = {
      id: 1, firstName: 'John', lastName: 'Doe', birthDate: new Date(),
      username: 'johndoe', email: 'john@example.com', phoneNumber: '1234567890',
      idNumber: '12345', role: 'ROLE_CUSTOMER'
    };

    service.getCustomerById(1).subscribe(customer => {
      expect(customer).toEqual(mockCustomer);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush(mockCustomer);
  });

  it('should add a new customer', () => {
    const newCustomer: Customer = {
      id: 3, firstName: 'Alice', lastName: 'Jones', birthDate: new Date(),
      username: 'alicejones', email: 'alice@example.com', phoneNumber: '1234567890',
      idNumber: '54321', role: 'ROLE_CUSTOMER'
    };

    service.addCustomer(newCustomer).subscribe(customer => {
      expect(customer).toEqual(newCustomer);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush(newCustomer);
  });

  it('should delete a customer by id', () => {
    service.deleteCustomer(1).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush(null);
  });

  it('should update an existing customer', () => {
    const updatedCustomer: Customer = {
      id: 1, firstName: 'John', lastName: 'Doe Updated', birthDate: new Date(),
      username: 'johndoe', email: 'johnupdated@example.com', phoneNumber: '1234567890',
      idNumber: '12345', role: 'ROLE_CUSTOMER'
    };

    service.updateCustomer(1, updatedCustomer).subscribe(customer => {
      expect(customer).toEqual(updatedCustomer);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush(updatedCustomer);
  });

});