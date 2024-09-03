import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerFormFieldsComponent } from './customer-form-fields.component';

describe('CustomerFormFieldsComponent', () => {
  let component: CustomerFormFieldsComponent;
  let fixture: ComponentFixture<CustomerFormFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerFormFieldsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerFormFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
