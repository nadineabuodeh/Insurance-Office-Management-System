import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { JwtResponse } from '../../model/jwt-response';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'saveToken', 'getUserRole']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error when login fails', () => {
    authService.login.and.returnValue(throwError(() => new Error('Invalid username or password')));
    component.loginForm.setValue({ username: 'testuser', password: 'wrongpassword' });
    component.onSubmit();
    expect(component.isLoginFailed).toBeTrue();
  });

  it('should navigate to customer dashboard on successful login', () => {
    const mockResponse: JwtResponse = {
      accessToken: 'token',
      roles: ['ROLE_CUSTOMER'],
      id: 1,
      username: 'testuser',
      email: 'testuser@example.com'
    };

    authService.login.and.returnValue(of(mockResponse));
    authService.getUserRole.and.returnValue('ROLE_CUSTOMER');

    component.loginForm.setValue({ username: 'testuser', password: 'correctpassword' });
    component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(['/customer/dashboard']);
    expect(component.isLoginFailed).toBeFalse();
  });
});