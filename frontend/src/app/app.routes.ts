import { Routes } from '@angular/router';
import { SplashScreenComponent } from './component/splash-screen/splash-screen.component';
import { LoginComponent } from './component/login/login.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { authGuard } from './service/auth.guard';

export const routes: Routes = [
    { path: '', component: SplashScreenComponent },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: '' }
];