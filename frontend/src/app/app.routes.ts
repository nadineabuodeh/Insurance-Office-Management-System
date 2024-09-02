import { Routes } from '@angular/router';
import { SplashScreenComponent } from './mainComponent/splash-screen/splash-screen.component';
import { LoginComponent } from './mainComponent/login/login.component';
import { AdminDashboardComponent } from './adminComponent/admin-dashboard/admin-dashboard.component';
import { adminGuard } from './service/admin.guard';
import { customerGuard } from './service/customer.guard';
import { UnauthorizedComponent } from './mainComponent/unauthorized/unauthorized.component';
import { AdminLayoutComponent } from './adminComponent/admin-layout/admin-layout.component';
import { CustomerLayoutComponent } from './customerComponent/customer-layout/customer-layout.component';
import { CustomerDetailsComponent } from './adminComponent/admin-customer/customer-details/customer-details.component';
import { PolicyLayoutComponent } from './adminComponent/admin-policy/policy-layout/policy-layout.component';
import { InsuranceTableComponent } from './adminComponent/admin-insurance/insurance-table/insurance-table.component';
import { TransactionTableComponent } from './adminComponent/admin-transactions/transaction-table/transaction-table.component';
import { PolicyCustomerComponent } from './customerComponent/customer-policies/policy-layout.component';
import { TransactionCustomerTableComponent } from './customerComponent/customer-payment-history/transaction-table/transaction-table.component';
import { TransactionDebtTableComponent } from './customerComponent/customer-debts/transaction-debt-table/transaction-table.component';

export const routes: Routes = [
  { path: '', component: SplashScreenComponent },
  { path: 'login', component: LoginComponent },

  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'customer', component: CustomerDetailsComponent },
      { path: 'customer/:id', component: CustomerDetailsComponent },
      { path: 'policy', component: PolicyLayoutComponent },
      { path: 'insurance', component: InsuranceTableComponent },
      { path: 'transactions', component: TransactionTableComponent },
      { path: '**', redirectTo: 'dashboard' },
    ],
  },
  {
    path: 'customer',
    component: CustomerLayoutComponent,
    canActivate: [customerGuard],
    children: [
      { path: 'policies', component: PolicyCustomerComponent },
      { path: 'payment-history', component: TransactionCustomerTableComponent },
      { path: 'debts', component: TransactionDebtTableComponent },
      { path: '**', redirectTo: 'policies' },
    ],
  },

  { path: 'unauthorized', component: UnauthorizedComponent },

  { path: '**', redirectTo: '' },
];
