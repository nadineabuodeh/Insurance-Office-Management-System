import { Routes } from '@angular/router';
import { SplashScreenComponent } from './mainComponent/splash-screen/splash-screen.component';
import { LoginComponent } from './mainComponent/login/login.component';
import { AdminDashboardComponent } from './adminComponent/admin-dashboard/admin-dashboard.component';
import { CustomerDashboardComponent } from './customerComponent/customer-dashboard/customer-dashboard.component';
import { adminGuard } from './service/admin.guard';
import { customerGuard } from './service/customer.guard';
import { UnauthorizedComponent } from './mainComponent/unauthorized/unauthorized.component';
import { AdminLayoutComponent } from './adminComponent/admin-layout/admin-layout.component';
import { CustomerLayoutComponent } from './customerComponent/customer-layout/customer-layout.component';
import { CustomerPoliciesComponent } from './customerComponent/customer-policies/customer-policies.component';
import { CustomerPaymentsComponent } from './customerComponent/customer-payments/customer-payments.component';
import { CustomerPaymentHistoryComponent } from './customerComponent/customer-payment-history/customer-payment-history.component';
import { CustomerDebtsComponent } from './customerComponent/customer-debts/customer-debts.component';
import { CustomerNotificationsComponent } from './customerComponent/customer-notifications/customer-notifications.component';
import { CustomerDetailsComponent } from './adminComponent/admin-customer/customer-details/customer-details.component';
import { PolicyLayoutComponent } from './adminComponent/admin-policy/policy-layout/policy-layout.component';
import { InsuranceTableComponent } from './adminComponent/admin-insurance/insurance-table/insurance-table.component';
import { TransactionTableComponent } from './adminComponent/admin-transactions/transaction-table/transaction-table.component';

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
      { path: 'dashboard', component: CustomerDashboardComponent },
      { path: 'policies', component: CustomerPoliciesComponent },
      { path: 'payments', component: CustomerPaymentsComponent },
      { path: 'payment-history', component: CustomerPaymentHistoryComponent },
      { path: 'debts', component: CustomerDebtsComponent },
      { path: 'notifications', component: CustomerNotificationsComponent },
    ],
  },

  { path: 'unauthorized', component: UnauthorizedComponent },

  { path: '**', redirectTo: '' },
];
