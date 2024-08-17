import { Component } from '@angular/core';
import { CustomerHeaderComponent } from "../customer-header/customer-header.component";
import { CustomerSidebarComponent } from "../customer-sidebar/customer-sidebar.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [CustomerHeaderComponent, CustomerSidebarComponent, RouterModule],
  templateUrl: './customer-layout.component.html',
  styleUrl: './customer-layout.component.css'
})
export class CustomerLayoutComponent {

}
