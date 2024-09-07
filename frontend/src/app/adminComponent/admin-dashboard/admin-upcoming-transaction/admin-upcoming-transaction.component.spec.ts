import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUpcomingTransactionComponent } from './admin-upcoming-transaction.component';

describe('AdminUpcomingTransactionComponent', () => {
  let component: AdminUpcomingTransactionComponent;
  let fixture: ComponentFixture<AdminUpcomingTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUpcomingTransactionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminUpcomingTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
