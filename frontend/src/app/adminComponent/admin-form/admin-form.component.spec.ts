import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminFormComponent } from './admin-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AdminFormComponent', () => {
  let component: AdminFormComponent;
  let fixture: ComponentFixture<AdminFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AdminFormComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with provided data', () => {
    component.data = {
      admin: {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        idNumber: 12345,
        email: 'john@example.com',
        phoneNumber: '1234567890',
        currency: 'USD',
        birthDate: '1990-01-01'
      }
    };
    
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.adminForm.value.firstName).toBe('John');
    expect(component.adminForm.value.lastName).toBe('Doe');
    expect(component.adminForm.value.email).toBe('john@example.com');
    expect(component.adminForm.value.phoneNumber).toBe('1234567890');
    expect(component.adminForm.value.currency).toBe('USD');
    expect(component.adminForm.value.birthDate).toBe('1990-01-01');
  });

  it('should call updateAdminProfile on valid form submission', () => {
    const adminServiceSpy = spyOn(component['adminService'], 'updateAdminProfile').and.callThrough();
    component.data = {
      admin: {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        idNumber: 12345,
        email: 'john@example.com',
        phoneNumber: '1234567890',
        currency: 'USD',
        birthDate: '1990-01-01'
      }
    };
    component.ngOnInit();
    fixture.detectChanges();

    component.adminForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phoneNumber: '1234567890',
      currency: 'USD',
      birthDate: '1990-01-01'
    });

    component.onSubmit();
    expect(adminServiceSpy).toHaveBeenCalled();
  });
});