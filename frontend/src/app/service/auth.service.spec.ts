import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { LoginRequest } from '../model/login-request';
import { JwtResponse } from '../model/jwt-response';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockJwtResponse: JwtResponse = {
    accessToken: 'mockAccessToken',
    roles: ['ROLE_ADMIN'],
    id: 1,
    username: 'adminUser',     
    email: 'admin@example.com' 
  };

  const mockLoginRequest: LoginRequest = {
    username: 'admin',
    password: 'password'
  };

  beforeEach(() => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, { provide: Router, useValue: routerSpyObj }]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and save token and adminId to localStorage', () => {
    service.login(mockLoginRequest).subscribe((response) => {
      expect(response).toEqual(mockJwtResponse);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/signin`);
    expect(req.request.method).toBe('POST');
    req.flush(mockJwtResponse);

    expect(localStorage.getItem('authToken')).toBe(mockJwtResponse.accessToken);
    expect(localStorage.getItem('userRole')).toBe('ROLE_ADMIN');
    expect(localStorage.getItem('adminId')).toBe('1');
  });

  it('should handle invalid login and return error message', () => {
    service.login(mockLoginRequest).subscribe({
      next: () => fail('expected an error'),
      error: (error: Error) => {
        expect(error.message).toBe('Invalid username or password!');
      }
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/signin`);
    expect(req.request.method).toBe('POST');
    req.flush('Invalid username or password!', { status: 401, statusText: 'Unauthorized' });
  });

  it('should logout and clear localStorage', () => {
    localStorage.setItem('authToken', 'mockAccessToken');
    localStorage.setItem('userRole', 'ROLE_ADMIN');
    localStorage.setItem('adminId', '1');

    service.logout();

    expect(localStorage.getItem('authToken')).toBeNull();
    expect(localStorage.getItem('userRole')).toBeNull();
    expect(localStorage.getItem('adminId')).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should check if the token is expired', () => {
    const now = new Date();
    const expiredTime = now.getTime() - 1000; 
    localStorage.setItem('tokenExpiration', expiredTime.toString());

    expect(service.isTokenExpired()).toBeTrue();

    const futureTime = now.getTime() + 1000;
    localStorage.setItem('tokenExpiration', futureTime.toString());

    expect(service.isTokenExpired()).toBeFalse();
  });

  it('should clear token from localStorage', () => {
    localStorage.setItem('authToken', 'mockAccessToken');
    localStorage.setItem('userRole', 'ROLE_ADMIN');
    localStorage.setItem('adminId', '1');

    service.clearToken();

    expect(localStorage.getItem('authToken')).toBeNull();
    expect(localStorage.getItem('userRole')).toBeNull();
    expect(localStorage.getItem('adminId')).toBeNull();
  });

  it('should retrieve adminId from localStorage', () => {
    localStorage.setItem('adminId', '1');
    const adminId = service.getAdminId();
    expect(adminId).toBe('1');
  });

  it('should return null for adminId if not present in localStorage', () => {
    const adminId = service.getAdminId();
    expect(adminId).toBeNull();
  });

  it('should return the user role from localStorage', () => {
    localStorage.setItem('userRole', 'ROLE_ADMIN');
    expect(service.getUserRole()).toBe('ROLE_ADMIN');
  });

  it('should return null if user role is not found in localStorage', () => {
    expect(service.getUserRole()).toBeNull();
  });
});