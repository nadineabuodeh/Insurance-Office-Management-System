import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyLayoutComponent } from './policy-layout.component';

describe('PolicyLayoutComponent', () => {
  let component: PolicyLayoutComponent;
  let fixture: ComponentFixture<PolicyLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
