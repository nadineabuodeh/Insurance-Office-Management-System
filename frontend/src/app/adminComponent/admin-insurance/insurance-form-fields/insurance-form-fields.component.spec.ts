import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceFormFieldsComponent } from './insurance-form-fields.component';

describe('InsuranceFormFieldsComponent', () => {
  let component: InsuranceFormFieldsComponent;
  let fixture: ComponentFixture<InsuranceFormFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsuranceFormFieldsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsuranceFormFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
