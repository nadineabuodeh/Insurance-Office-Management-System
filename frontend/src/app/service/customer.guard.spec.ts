import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { customerGuard } from './customer.guard';
import { CanActivateFn } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('customerGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => customerGuard(...guardParameters));

  beforeEach(() => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['isTokenExpired', 'clearToken', 'getUserRole']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should redirect to login if the token is expired', () => {
    authServiceSpy.isTokenExpired.and.returnValue(true);

    const result = executeGuard(null as any, null as any);

    expect(result).toBeFalse();
    expect(authServiceSpy.clearToken).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should redirect to unauthorized if the user role is not ROLE_CUSTOMER', () => {
    authServiceSpy.isTokenExpired.and.returnValue(false);
    authServiceSpy.getUserRole.and.returnValue('ROLE_ADMIN');

    const result = executeGuard(null as any, null as any);

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });

  it('should allow access if the token is valid and the user is ROLE_CUSTOMER', () => {
    authServiceSpy.isTokenExpired.and.returnValue(false);
    authServiceSpy.getUserRole.and.returnValue('ROLE_CUSTOMER');

    const result = executeGuard(null as any, null as any);

    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});