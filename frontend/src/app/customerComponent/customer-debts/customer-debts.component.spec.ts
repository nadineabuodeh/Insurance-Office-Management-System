import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDebtsComponent } from './customer-debts.component';

describe('CustomerDebtsComponent', () => {
  let component: CustomerDebtsComponent;
  let fixture: ComponentFixture<CustomerDebtsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerDebtsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerDebtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
