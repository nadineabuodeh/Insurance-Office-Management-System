import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SplashScreenComponent } from './splash-screen.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

describe('SplashScreenComponent', () => {
  let component: SplashScreenComponent;
  let fixture: ComponentFixture<SplashScreenComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isTokenExpired', 'getUserRole']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        SplashScreenComponent,
        RouterTestingModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SplashScreenComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  beforeEach(() => {
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login if token is expired', () => {
    authService.isTokenExpired.and.returnValue(true);

    component.ngOnInit();
    jasmine.clock().tick(3000);

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to admin dashboard if role is admin and token is valid', () => {
    authService.isTokenExpired.and.returnValue(false);
    authService.getUserRole.and.returnValue('ROLE_ADMIN');

    component.ngOnInit();
    jasmine.clock().tick(3000);

    expect(router.navigate).toHaveBeenCalledWith(['/admin/dashboard']);
  });

  it('should navigate to customer dashboard if role is customer and token is valid', () => {
    authService.isTokenExpired.and.returnValue(false);
    authService.getUserRole.and.returnValue('ROLE_CUSTOMER');

    component.ngOnInit();
    jasmine.clock().tick(3000);

    expect(router.navigate).toHaveBeenCalledWith(['/customer/dashboard']);
  });
});