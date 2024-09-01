import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTransactionComponent } from './customer-transaction.component';

describe('CustomerTransactionComponent', () => {
  let component: CustomerTransactionComponent;
  let fixture: ComponentFixture<CustomerTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerTransactionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
