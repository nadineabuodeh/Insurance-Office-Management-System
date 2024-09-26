import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerTreeListComponent } from './customer-tree-list.component'; 
import { HttpClientModule } from '@angular/common/http'; 
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomerService } from '../../../service/CustomerService/customer.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('CustomerTreeListComponent', () => {
  let component: CustomerTreeListComponent;
  let fixture: ComponentFixture<CustomerTreeListComponent>;
  let mockCustomerService: jasmine.SpyObj<CustomerService>;

  const mockCustomers = [
    { id: 1, firstName: 'John', lastName: 'Doe', birthDate: new Date(), username: 'johndoe', email: 'john@example.com', phoneNumber: '1234567890', idNumber: '12345', role: 'ROLE_CUSTOMER' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', birthDate: new Date(), username: 'janesmith', email: 'jane@example.com', phoneNumber: '0987654321', idNumber: '67890', role: 'ROLE_CUSTOMER' }
  ];

  beforeEach(async () => {
    mockCustomerService = jasmine.createSpyObj('CustomerService', ['getCustomers', 'addCustomer']);
    
    mockCustomerService.customersChanged$ = of(); 
    mockCustomerService.getCustomers.and.returnValue(of(mockCustomers));
  
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, MatDialogModule, RouterTestingModule, FormsModule, CustomerTreeListComponent],
      providers: [{ provide: CustomerService, useValue: mockCustomerService }],
    }).compileComponents();
  
    fixture = TestBed.createComponent(CustomerTreeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });  

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load customers on init', () => {
    expect(mockCustomerService.getCustomers).toHaveBeenCalled();
    expect(component.customers.length).toBe(2);
  });

  it('should filter customers based on search input', () => {
    component.searchQuery = 'Jane'; 
    fixture.detectChanges(); 
    const filteredCustomers = component.filteredCustomers();
    expect(filteredCustomers.length).toBe(1);
    expect(filteredCustomers[0].firstName).toBe('Jane');
  });

  it('should show "No Customers" message when no customers are available', () => {
    mockCustomerService.getCustomers.and.returnValue(of([])); 
    component.fetchCustomers(); 
    fixture.detectChanges(); 

    expect(component.errorMessage).toBe('No customers available.');
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-text')?.textContent).toContain('There Are No Customers!');
  });

  it('should call addCustomer when Add button is clicked', () => {
    spyOn(component, 'onAddButtonClick'); 
    const addButton = fixture.debugElement.nativeElement.querySelector('.add-search-btns');
    addButton.click(); 
    expect(component.onAddButtonClick).toHaveBeenCalled();
  });
});