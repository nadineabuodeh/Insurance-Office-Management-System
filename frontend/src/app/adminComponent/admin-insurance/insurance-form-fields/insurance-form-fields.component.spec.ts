import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { InsuranceFormFieldsComponent } from './insurance-form-fields.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';

describe('InsuranceFormFieldsComponent', () => {
  let component: InsuranceFormFieldsComponent;
  let fixture: ComponentFixture<InsuranceFormFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InsuranceFormFieldsComponent,
        ReactiveFormsModule,   
        NoopAnimationsModule,  
        MatDialogModule        
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InsuranceFormFieldsComponent);
    component = fixture.componentInstance;

    component.formGroup = new FormGroup({
      insuranceType: new FormControl('HEALTH'),
      description: new FormControl('Some description'),
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.formGroup.get('insuranceType')?.value).toBe('HEALTH');
    expect(component.formGroup.get('description')?.value).toBe('Some description');
  });

  it('should reset form values on cancel if form is dirty', () => {
    component.formGroup.markAsDirty();
    spyOn(window, 'confirm').and.returnValue(true);
    component.onCancel();
    fixture.detectChanges();
    
    expect(component.formGroup.pristine).toBeTrue();
    expect(component.formGroup.get('insuranceType')?.value).toBe('HEALTH');
  });

  it('should disable insuranceType field in edit mode', () => {
    component.isEditMode = true;
    component.ngOnInit();
    expect(component.formGroup.get('insuranceType')?.disabled).toBeTrue();
  });
});