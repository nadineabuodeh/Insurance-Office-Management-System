import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomerSidebarComponent } from './customer-sidebar.component';
import { Router } from '@angular/router';

describe('CustomerSidebarComponent', () => {
  let component: CustomerSidebarComponent;
  let fixture: ComponentFixture<CustomerSidebarComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CustomerSidebarComponent,
        RouterTestingModule.withRoutes([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerSidebarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the correct route', () => {
    spyOn(router, 'navigate');
    component.navigateTo('info');
    expect(router.navigate).toHaveBeenCalledWith(['/customer/info']);
    expect(component.activeRoute).toBe('info');
  });

  it('should set active route based on the route snapshot', () => {
    component.activeRoute = 'policies';
    expect(component.activeRoute).toBe('policies');
  });
});