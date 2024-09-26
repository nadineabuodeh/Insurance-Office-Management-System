import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AdminFormFieldsComponent } from './admin-form-fields.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AdminFormFieldsComponent', () => {
  let component: AdminFormFieldsComponent;
  let fixture: ComponentFixture<AdminFormFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AdminFormFieldsComponent,
        HttpClientTestingModule,
        MatDialogModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminFormFieldsComponent);
    component = fixture.componentInstance;

    component.formGroup = new FormGroup({
      firstName: new FormControl('John'),
      lastName: new FormControl('Doe'),
      username: new FormControl('admin'),
      idNumber: new FormControl(''),
      phoneNumber: new FormControl(''),
      email: new FormControl(''),
      currency: new FormControl('NIS'),
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.formGroup.get('firstName')?.value).toBe('John');
    expect(component.formGroup.get('lastName')?.value).toBe('Doe');
    expect(component.formGroup.get('username')?.value).toBe('admin');
    expect(component.formGroup.get('currency')?.value).toBe('NIS');
  });

  it('should reset form values on cancel if form is dirty', () => {
    component.formGroup.markAsDirty();
    spyOn(window, 'confirm').and.returnValue(true);
    component.onCancel();
    expect(component.formGroup.pristine).toBeTrue();
    expect(component.formGroup.get('firstName')?.value).toBe('John');
  });

  it('should keep form values unchanged on cancel if form is not dirty', () => {
    component.formGroup.markAsPristine();
    component.onCancel();
    expect(component.formGroup.get('firstName')?.value).toBe('John');
  });

  it('should populate currency options with symbols', () => {
    expect(component.currenciesWithSymbols.length).toBe(4);
    expect(component.currenciesWithSymbols[0].code).toBe('NIS');
    expect(component.currenciesWithSymbols[0].symbol).toBe('₪');
  });
});