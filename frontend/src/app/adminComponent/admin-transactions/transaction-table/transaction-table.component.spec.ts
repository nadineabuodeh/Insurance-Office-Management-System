import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TransactionTableComponent } from './transaction-table.component';

describe('TransactionTableComponent', () => {
  let component: TransactionTableComponent;
  let fixture: ComponentFixture<TransactionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        TransactionTableComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load transactions', () => {
    spyOn(component, 'loadTransactions').and.callThrough();
    component.loadTransactions();
    expect(component.loadTransactions).toHaveBeenCalled();
  });

  it('should filter transactions by amount', () => {
    const event = { target: { value: '100' } } as any;
    component.AmountFilter(event);
    expect(component.dataSource.filter).toBe('100');
  });

  it('should toggle filter visibility', () => {
    component.toggleFilter();
    expect(component.showFilter).toBeTrue();
  });

  it('should clear filters', () => {
    spyOn(component, 'clearFilter').and.callThrough();
    component.clearFilter();
    expect(component.clearFilter).toHaveBeenCalled();
  });
});