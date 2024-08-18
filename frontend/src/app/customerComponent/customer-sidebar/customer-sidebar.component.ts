import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-customer-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-sidebar.component.html',
  styleUrl: './customer-sidebar.component.css'
})
export class CustomerSidebarComponent {
  activeRoute: string;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.activeRoute = this.route.snapshot.firstChild?.routeConfig?.path || 'dashboard';
  }

  navigateTo(route: string): void {
    this.router.navigate([`/customer/${route}`]);
    this.activeRoute = route;
  }
}
