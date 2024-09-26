import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { InsuranceTableComponent } from './insurance-table.component';
import { of } from 'rxjs';
import { InsuranceService } from '../../../service/insurance.service';
import { MatTableDataSource } from '@angular/material/table';

describe('InsuranceTableComponent', () => {
  let component: InsuranceTableComponent;
  let fixture: ComponentFixture<InsuranceTableComponent>;
  let insuranceServiceSpy: jasmine.SpyObj<InsuranceService>;

  beforeEach(async () => {
    const insuranceServiceMock = jasmine.createSpyObj('InsuranceService', ['getInsurances', 'deleteInsurance', 'updateInsurance']);
    insuranceServiceMock.getInsurances.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [InsuranceTableComponent, HttpClientTestingModule, MatDialogModule],
      providers: [{ provide: InsuranceService, useValue: insuranceServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(InsuranceTableComponent);
    component = fixture.componentInstance;
    insuranceServiceSpy = TestBed.inject(InsuranceService) as jasmine.SpyObj<InsuranceService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load insurances on init', () => {
    component.ngOnInit();
    expect(insuranceServiceSpy.getInsurances).toHaveBeenCalled();
    expect(component.dataSource instanceof MatTableDataSource).toBe(true);
  });

  it('should call deleteInsurance when delete is confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    insuranceServiceSpy.deleteInsurance.and.returnValue(of(void 0));

    component.deleteInsurance(1);
    expect(insuranceServiceSpy.deleteInsurance).toHaveBeenCalledWith(1);
  });

  it('should not call deleteInsurance when delete is cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteInsurance(1);
    expect(insuranceServiceSpy.deleteInsurance).not.toHaveBeenCalled();
  });

  it('should open the dialog when add button is clicked', () => {
    spyOn(component.dialog, 'open').and.callThrough();

    component.onAddButtonClick();
    expect(component.dialog.open).toHaveBeenCalled();
  });
});