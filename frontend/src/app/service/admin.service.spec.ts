import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminService } from './admin.service';
import { Admin } from '../model/admin.model';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;

  const mockAdmin: Admin = {
    id: 1,
    idNumber: 123456789,
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    email: 'john.doe@example.com',
    birthDate: new Date('1990-01-01'),
    phoneNumber: '1234567890',
    currency: 'USD'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminService]
    });
    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve admin profile', () => {
    const mockToken = 'mockAuthToken';
    localStorage.setItem('authToken', mockToken);

    service.getAdminProfile().subscribe((profile) => {
      expect(profile).toEqual(mockAdmin);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/profile`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);

    req.flush(mockAdmin);
  });

  it('should update admin profile', () => {
    const mockToken = 'mockAuthToken';
    localStorage.setItem('authToken', mockToken);

    service.updateAdminProfile(mockAdmin.id, mockAdmin).subscribe((response) => {
      expect(response).toEqual({ success: true });
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/updateProfile`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockAdmin);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);

    req.flush({ success: true });
  });
});