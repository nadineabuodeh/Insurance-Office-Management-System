import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminDetailsComponent } from './admin-details.component';

describe('AdminDetailsComponent', () => {
  let component: AdminDetailsComponent;
  let fixture: ComponentFixture<AdminDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AdminDetailsComponent,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch admin profile on init', () => {
    spyOn(component, 'fetchAdminProfile');
    component.ngOnInit();
    expect(component.fetchAdminProfile).toHaveBeenCalled();
  });

  it('should display admin details', () => {
    component.admin = {
      id: 1,
      idNumber: 12345,
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      birthDate: new Date(),
      phoneNumber: '1234567890',
      currency: 'USD',
    };
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(
      compiled.querySelector('.info-item:nth-child(1) span')?.textContent
    ).toContain('John');
    expect(
      compiled.querySelector('.info-item:nth-child(3) span')?.textContent
    ).toContain('johndoe');
  });
});
