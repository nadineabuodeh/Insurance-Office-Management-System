import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTreeListComponent } from './customer-tree-list.component';

describe('CustomerTreeListComponent', () => {
  let component: CustomerTreeListComponent;
  let fixture: ComponentFixture<CustomerTreeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerTreeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerTreeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
