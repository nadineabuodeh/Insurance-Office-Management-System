import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css',
})
export class AdminHeaderComponent {
  constructor(private router: Router, private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }

  openSettings(): void {
    const adminId = this.authService.getAdminId();
    if (adminId) {
      this.router.navigate([`/admin/admin-details/${adminId}`]);
    } else {
      console.error('Admin ID not found!!');
    }

  }
}
