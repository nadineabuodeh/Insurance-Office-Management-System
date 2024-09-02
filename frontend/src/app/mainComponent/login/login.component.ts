import { Component } from '@angular/core';
import { LoginRequest } from '../../model/login-request';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginRequest: LoginRequest = {
    username: '',
    password: '',
  };
  errorMessage: string | null = null;
  toastTimeout: any;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login(this.loginRequest).subscribe({
      next: (response) => {
        const token = response.accessToken;
        const role = response.roles[0];
        this.authService.saveToken(token, role);
        this.redirectBasedOnRole();
      },
      error: (error: Error) => {
        this.showToast(error.message);
      },
    });
  }

  private redirectBasedOnRole(): void {
    const role = this.authService.getUserRole();
    if (role === 'ROLE_ADMIN') {
      this.router.navigate(['/admin/dashboard']);
    } else if (role === 'ROLE_CUSTOMER') {
      this.router.navigate(['/customer/dashboard']);
    }
  }

  showToast(message: string): void {
    this.errorMessage = message;
    this.toastTimeout = setTimeout(() => {
      this.clearToast();
    }, 5000);
  }

  closeToast(): void {
    this.clearToast();
  }

  clearToast(): void {
    this.errorMessage = null;
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
  }
}
