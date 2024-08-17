import { Routes } from '@angular/router';
import { authGuard } from './service/auth.guard';
import { SplashScreenComponent } from './mainComponent/splash-screen/splash-screen.component';
import { LoginComponent } from './mainComponent/login/login.component';
import { AdminDashboardComponent } from './adminComponent/admin-dashboard/admin-dashboard.component';
import { CustomerDashboardComponent } from './customerComponent/customer-dashboard/customer-dashboard.component';
import { adminGuard } from './service/admin.guard';
import { customerGuard } from './service/customer.guard';
import { UnauthorizedComponent } from './mainComponent/unauthorized/unauthorized.component';

export const routes: Routes = [
  { path: '', component: SplashScreenComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'customer/dashboard', component: CustomerDashboardComponent, canActivate: [customerGuard] },
  { path: 'unauthorized', component: UnauthorizedComponent }, // Route for unauthorized access
  { path: '**', redirectTo: '' }
];