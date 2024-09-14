import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CustomerTreeListComponent } from './adminComponent/admin-customer/customer-tree-list/customer-tree-list.component';
import { LoadingIndicatorComponent } from './mainComponent/loading-indicator/loading-indicator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, CustomerTreeListComponent, LoadingIndicatorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  onCustomerSelected() {
    throw new Error('Method not implemented.');
  }
  title = 'InsuranceNexus';
  activeRoute: any;
}
