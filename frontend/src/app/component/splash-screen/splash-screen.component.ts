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
        this.router.navigate(['/dashboard']);
      }
    }, 3000);
  }
}
