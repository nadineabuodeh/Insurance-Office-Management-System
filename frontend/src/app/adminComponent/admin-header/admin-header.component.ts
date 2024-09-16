import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [NgClass],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css',
})
export class AdminHeaderComponent {
  isCurrencyRoute: boolean = false;

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isCurrencyRoute = this.router.url.includes('/currency');
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  openSettings(): void {
    if (!this.isCurrencyRoute) {
      const adminId = this.authService.getAdminId();
      if (adminId) {
        this.router.navigate([`/admin/admin-details/${adminId}`]);
      } else {
        console.error('Admin ID not found!!');
      }
    }
  }
}
