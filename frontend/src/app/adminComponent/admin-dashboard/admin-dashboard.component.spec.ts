import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDashboardComponent } from './admin-dashboard.component';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render Upcoming Transaction title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Upcoming Transaction');
  });

  it('should contain app-admin-upcoming-transaction component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const upcomingTransactionComponent = compiled.querySelector('app-admin-upcoming-transaction');
    expect(upcomingTransactionComponent).not.toBeNull();
  });
});