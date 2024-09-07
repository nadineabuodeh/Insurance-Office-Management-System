import { Component } from '@angular/core';
import { AdminUpcomingTransactionComponent } from "./admin-upcoming-transaction/admin-upcoming-transaction.component";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [AdminUpcomingTransactionComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

}
