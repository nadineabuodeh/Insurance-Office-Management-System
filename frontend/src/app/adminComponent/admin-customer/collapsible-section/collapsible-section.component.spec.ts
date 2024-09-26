import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CollapsibleSectionComponent } from './collapsible-section.component';

describe('CollapsibleSectionComponent', () => {
  let component: CollapsibleSectionComponent;
  let fixture: ComponentFixture<CollapsibleSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollapsibleSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CollapsibleSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct header', () => {
    component.header = 'Test Header';
    fixture.detectChanges();
    const headerElement = fixture.debugElement.query(By.css('.collapsible-header')).nativeElement;
    expect(headerElement.textContent).toContain('Test Header');
  });

  it('should be collapsed by default', () => {
    expect(component.isCollapsed).toBeTrue(); 
    const contentElement = fixture.debugElement.query(By.css('.collapsible-content'));
    expect(contentElement.nativeElement.classList).not.toContain('show');
  });

  it('should toggle the collapse state', () => {
    const headerButton = fixture.debugElement.query(By.css('.collapsible-header'));
    
    headerButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.isCollapsed).toBeFalse();
    const contentElement = fixture.debugElement.query(By.css('.collapsible-content'));
    expect(contentElement.nativeElement.classList).toContain('show');

    headerButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.isCollapsed).toBeTrue();
    expect(contentElement.nativeElement.classList).not.toContain('show');
  });
});