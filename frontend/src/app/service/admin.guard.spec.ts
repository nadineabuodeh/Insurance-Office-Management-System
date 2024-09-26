import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { adminGuard } from './admin.guard';
import { RouterTestingModule } from '@angular/router/testing';

describe('adminGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['isTokenExpired', 'clearToken', 'getUserRole']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ]
    });

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should return false and navigate to login if the token is expired', () => {
    authServiceSpy.isTokenExpired.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => adminGuard(null as any, null as any));

    expect(result).toBeFalse();
    expect(authServiceSpy.clearToken).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should return false and navigate to unauthorized if the user is not an admin', () => {
    authServiceSpy.isTokenExpired.and.returnValue(false);
    authServiceSpy.getUserRole.and.returnValue('ROLE_USER');

    const result = TestBed.runInInjectionContext(() => adminGuard(null as any, null as any));

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });

  it('should return true if the user is an admin and the token is valid', () => {
    authServiceSpy.isTokenExpired.and.returnValue(false);
    authServiceSpy.getUserRole.and.returnValue('ROLE_ADMIN');

    const result = TestBed.runInInjectionContext(() => adminGuard(null as any, null as any));

    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});