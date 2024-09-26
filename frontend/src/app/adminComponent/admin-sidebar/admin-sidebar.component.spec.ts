import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminSidebarComponent } from './admin-sidebar.component';
import { Router } from '@angular/router';

describe('AdminSidebarComponent', () => {
  let component: AdminSidebarComponent;
  let fixture: ComponentFixture<AdminSidebarComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AdminSidebarComponent,
        RouterTestingModule.withRoutes([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSidebarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to dashboard when dashboard button is clicked', () => {
    spyOn(component, 'navigateTo').and.callThrough();
    const dashboardButton = fixture.nativeElement.querySelector('button');
    dashboardButton.click();
    expect(component.navigateTo).toHaveBeenCalledWith('dashboard');
    expect(router.url).toBe('/');
  });
});