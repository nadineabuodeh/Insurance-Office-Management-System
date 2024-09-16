import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFomFieldsComponent } from './admin-form-fields.component';

describe('AdminFomFieldsComponent', () => {
  let component: AdminFomFieldsComponent;
  let fixture: ComponentFixture<AdminFomFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminFomFieldsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminFomFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
