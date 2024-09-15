import { OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'; import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-select-currency',
  standalone: true,
  imports: [NgClass, CommonModule, MatFormFieldModule,
    MatInputModule, FormsModule,
    MatButtonModule, MatOptionModule, MatSelectModule],
  templateUrl: './select-currency.component.html',
  styleUrl: './select-currency.component.css'
})
export class SelectCurrencyComponent implements OnInit {
  currencies = ['ILS', 'USD', 'EUR', 'JOD']
  selectedCurrency: string = 'ILS';;
  // selectedCurrency: string = 'ILS';
  currencyError: boolean = false;
  username: string | undefined;
  currencySymbols: { [key: string]: string } = {
    ILS: '₪',
    USD: '$',
    EUR: '€',
    JOD: '',

  };
  currenciesWithSymbols: { code: string; symbol: string }[] = [];

  constructor(private router: Router, private route: ActivatedRoute) { }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.username = params['username'];
      console.log("USERNAME -> " + this.username);
    });

    this.currenciesWithSymbols = this.currencies.map(currencyCode => ({
      code: currencyCode,
      symbol: this.getCurrencySymbol(currencyCode)
    }));
  }


  getCurrencySymbol(currencyCode: string): string {
    return this.currencySymbols[currencyCode] || currencyCode;
  }


  onCurrencySelect(): void {
    if (this.selectedCurrency) {
      localStorage.setItem('defaultCurrency', this.selectedCurrency);
      console.log("currency -> " + this.selectedCurrency)
      this.currencyError = false;
      this.router.navigate(['#']);
    }
    else {
      this.currencyError = true;

    }

    console.log()
  }

  clearCurrency(): void {
    localStorage.removeItem('defaultCurrency');
    this.selectedCurrency = 'ILS';;
    this.currencyError = false;
  }


}
