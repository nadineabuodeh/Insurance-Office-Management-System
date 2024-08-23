import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerTreeListComponent } from "../admin-customer/customer-tree-list/customer-tree-list.component";
import { SplitterModule } from 'primeng/splitter';
import { TreeModule } from 'primeng/tree';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, CustomerTreeListComponent,TreeModule,SplitterModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css'
})
export class AdminSidebarComponent {

  activeRoute: string;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.activeRoute = this.route.snapshot.firstChild?.routeConfig?.path || 'dashboard';
   
  
  }

  navigateTo(route: string): void {
    this.router.navigate([`/admin/${route}`]);
    this.activeRoute = route;
  }

}
