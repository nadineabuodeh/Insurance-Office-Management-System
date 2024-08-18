import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTableRowComponent } from './customer-table-row.component';

describe('CustomerTableRowComponent', () => {
  let component: CustomerTableRowComponent;
  let fixture: ComponentFixture<CustomerTableRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerTableRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerTableRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
