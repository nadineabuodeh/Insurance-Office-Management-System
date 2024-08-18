import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [],
  templateUrl: './splash-screen.component.html',
  styleUrl: './splash-screen.component.css'
})
export class SplashScreenComponent {
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      if (this.authService.isTokenExpired()) {
        this.router.navigate(['/login']);
      } else {
        this.redirectBasedOnRole();
      }
    }, 3000);
  }

  private redirectBasedOnRole(): void {
    const role = this.authService.getUserRole();
    if (role === 'ROLE_ADMIN') {
      this.router.navigate(['/admin/dashboard']);
    } else if (role === 'ROLE_CUSTOMER') {
      this.router.navigate(['/customer/dashboard']);
    }
  }
}