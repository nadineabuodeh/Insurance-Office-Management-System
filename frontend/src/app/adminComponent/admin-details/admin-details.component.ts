import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { NgClass, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-admin-details',
  standalone: true,
  imports: [NgClass, CommonModule, MatFormFieldModule,
    MatInputModule, FormsModule,
    MatButtonModule, MatOptionModule, MatSelectModule],  templateUrl: './admin-details.component.html',
  styleUrl: './admin-details.component.css'
})
export class AdminDetailsComponent implements OnInit {
  username: string | undefined;
  currencies = ['ILS', 'USD', 'EUR', 'JOD'];
  selectedCurrency: string = 'ILS';
  currencySymbols: { [key: string]: string } = {
    ILS: '₪',
    USD: '$',
    EUR: '€',
    JOD: '',
  };
  currenciesWithSymbols: { code: string; symbol: string }[] = [];

  constructor(private router: Router, private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const adminId = this.authService.getAdminId();
    if (adminId) {
      console.log("Admin ID ------> " + adminId)
    }
    this.route.queryParams.subscribe(params => {
      this.username = params['username'];
      console.log("USERNAME22 -> " + this.username);
    });

    this.selectedCurrency = localStorage.getItem('defaultCurrency') || 'ILS';
    this.currenciesWithSymbols = this.currencies.map(currencyCode => ({
      code: currencyCode,
      symbol: this.getCurrencySymbol(currencyCode)
    }));
  }

 

  getCurrencySymbol(currencyCode: string): string {
    return this.currencySymbols[currencyCode] || currencyCode;
  }

  onCurrencyChange(): void {
    localStorage.setItem('defaultCurrency', this.selectedCurrency);
    console.log("Selected currency changed to:", this.selectedCurrency);
  }


}
