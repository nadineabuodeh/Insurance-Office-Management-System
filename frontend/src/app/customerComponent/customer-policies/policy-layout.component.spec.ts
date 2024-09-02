import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PolicyCustomerComponent } from './policy-layout.component';

describe('PolicyCustomerComponent', () => {
  let component: PolicyCustomerComponent;
  let fixture: ComponentFixture<PolicyCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyCustomerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PolicyCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
