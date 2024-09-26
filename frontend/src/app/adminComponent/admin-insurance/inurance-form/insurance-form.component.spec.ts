import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InsuranceFormComponent } from './insurance-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { InsuranceService } from '../../../service/insurance.service';
import { of } from 'rxjs';

describe('InsuranceFormComponent', () => {
  let component: InsuranceFormComponent;
  let fixture: ComponentFixture<InsuranceFormComponent>;
  let insuranceServiceSpy: jasmine.SpyObj<InsuranceService>;

  beforeEach(async () => {
    const insuranceServiceMock = jasmine.createSpyObj('InsuranceService', ['addInsurance', 'updateInsurance']);
    await TestBed.configureTestingModule({
      imports: [
        InsuranceFormComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: InsuranceService, useValue: insuranceServiceMock }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InsuranceFormComponent);
    component = fixture.componentInstance;
    insuranceServiceSpy = TestBed.inject(InsuranceService) as jasmine.SpyObj<InsuranceService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit the form and call addInsurance if not in edit mode', () => {
    component.isEditMode = false;
    component.insuranceForm.setValue({
      insuranceType: 'HEALTH',
      description: 'Health insurance description',
    });

    insuranceServiceSpy.addInsurance.and.returnValue(of({ id: 1, insuranceType: 'HEALTH', description: 'Health insurance description' }));
    component.onSubmit();
    
    expect(insuranceServiceSpy.addInsurance).toHaveBeenCalled();
    expect((component as any)['dialogRef'].close).toHaveBeenCalled();
  });

  it('should submit the form and call updateInsurance if in edit mode', () => {
    component.isEditMode = true;
    component.data = { insurance: { id: 1 } };
    component.insuranceForm.setValue({
      insuranceType: 'LIFE',
      description: 'Life insurance description',
    });

    insuranceServiceSpy.updateInsurance.and.returnValue(of({ id: 1, insuranceType: 'LIFE', description: 'Life insurance description' }));
    component.onSubmit();

    expect(insuranceServiceSpy.updateInsurance).toHaveBeenCalledWith(1, component.insuranceForm.getRawValue());
    expect((component as any)['dialogRef'].close).toHaveBeenCalled(); 
  });

  it('should close the dialog on cancel', () => {
    component.onCancel();
    expect((component as any)['dialogRef'].close).toHaveBeenCalled();
  });
});