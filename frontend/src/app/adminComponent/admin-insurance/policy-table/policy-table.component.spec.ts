import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyTableComponent } from './policy-table.component';

describe('PolicyTableComponent', () => {
  let component: PolicyTableComponent;
  let fixture: ComponentFixture<PolicyTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
