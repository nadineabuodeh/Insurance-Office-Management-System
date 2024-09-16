import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CustomerTreeListComponent } from '../admin-customer/customer-tree-list/customer-tree-list.component';
import { SplitterModule } from 'primeng/splitter';
import { TreeModule } from 'primeng/tree';
import { CustomerDetailsComponent } from '../admin-customer/customer-details/customer-details.component';
import { Customer } from '../../service/CustomerService/customer.service';
import { RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CustomerTreeListComponent,
    TreeModule,
    SplitterModule,
    CustomerDetailsComponent,
  ],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css',
})
export class AdminSidebarComponent {
  activeRoute: string;
  selectedCustomer: any;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.activeRoute =
      this.route.snapshot.firstChild?.routeConfig?.path || 'dashboard';
  }

  navigateTo(route: string): void {
    this.router.navigate([`/admin/${route}`]);
    this.activeRoute = route;
  }

  onCustomerSelected(customer: Customer): void {
    this.selectedCustomer = customer;
  }

}

