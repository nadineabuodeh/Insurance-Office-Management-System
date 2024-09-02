import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyFormFieldsComponent } from './policy-form-fields.component';

describe('PolicyFormFieldsComponent', () => {
  let component: PolicyFormFieldsComponent;
  let fixture: ComponentFixture<PolicyFormFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyFormFieldsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PolicyFormFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
