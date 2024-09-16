import { CurrencyService } from './../../service/currency.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { LoadingService } from '../../service/loading.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoginFailed: boolean = false;
  defaultCurrency: string | undefined;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService,
    private currencyService: CurrencyService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    localStorage.clear();
    this.loadingService.loadingOn();

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        const token = response.accessToken;
        const role = response.roles[0];
        this.authService.saveToken(token, role);
        this.isLoginFailed = false;

        this.loadingService.loadingOff();
        // this.redirectBasedOnRole();
        this.redirectBasedOnRole(this.loginForm.value.username);

      },
      error: () => {
        this.loadingService.loadingOff();
        this.isLoginFailed = true;
      },
    });
  }


  private redirectBasedOnRole(username: string): void {
    const role = this.authService.getUserRole();

    if (role === 'ROLE_ADMIN') {
      this.currencyService.getAdminCurrency().subscribe({
        next: (currency) => {
          if (!currency) {
            this.router.navigate(['/admin/currency'], { queryParams: { username: username } });
          } else {
            this.router.navigate(['/admin/dashboard']);
          }
        },
        error: () => {
          this.router.navigate(['/admin/dashboard']);
        }
      });
    } else if (role === 'ROLE_CUSTOMER') {
      this.router.navigate(['/customer/dashboard']);
    }
  }


}