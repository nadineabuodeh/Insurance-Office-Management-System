import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CustomerFormComponent } from "./components/customer-form/customer-form.component";
import { CustomerTableComponent } from './components/customer-table/customer-table.component';
import { CustomerTableRowComponent } from './components/customer-table-row/customer-table-row.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CustomerFormComponent, CustomerTableComponent, CustomerTableRowComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontendAngular';
}
