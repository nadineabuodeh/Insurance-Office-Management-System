import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomerLayoutComponent } from './customer-layout.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomerHeaderComponent } from '../customer-header/customer-header.component';
import { CustomerSidebarComponent } from '../customer-sidebar/customer-sidebar.component';

describe('CustomerLayoutComponent', () => {
  let component: CustomerLayoutComponent;
  let fixture: ComponentFixture<CustomerLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CustomerLayoutComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        CustomerHeaderComponent,
        CustomerSidebarComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});