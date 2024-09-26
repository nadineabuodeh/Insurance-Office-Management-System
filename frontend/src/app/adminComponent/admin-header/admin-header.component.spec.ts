import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminHeaderComponent } from './admin-header.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../service/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { ReplaySubject } from 'rxjs';

describe('AdminHeaderComponent', () => {
  let component: AdminHeaderComponent;
  let fixture: ComponentFixture<AdminHeaderComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;
  let mockRouterEvents$: ReplaySubject<any>;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['logout', 'getAdminId']);

    mockRouterEvents$ = new ReplaySubject<any>(1);

    await TestBed.configureTestingModule({
      imports: [AdminHeaderComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminHeaderComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);

    spyOnProperty(router, 'events').and.returnValue(mockRouterEvents$); 
    spyOnProperty(router, 'url').and.returnValue('/currency'); 

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to settings when openSettings is called if not on currency route', () => {
    authServiceSpy.getAdminId.and.returnValue('1');
    spyOn(router, 'navigate');

    component.isCurrencyRoute = false;
    component.openSettings();

    expect(router.navigate).toHaveBeenCalledWith(['/admin/admin-details/1']);
  });

  it('should not navigate to settings if on currency route', () => {
    spyOn(router, 'navigate');
    component.isCurrencyRoute = true;

    component.openSettings();

    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should call AuthService.logout on logout', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });
});
