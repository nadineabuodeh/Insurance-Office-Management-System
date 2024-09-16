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
import { CurrencyService } from '../../service/currency.service';
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
  currencies = ['NIS', 'USD', 'EUR', 'JOD']
  selectedCurrency: string = 'NIS';;
  username: string | undefined;
  currencySymbols: { [key: string]: string } = {
    NIS: '₪',
    USD: '$',
    EUR: '€',
    JOD: 'JOD',

  };
  currenciesWithSymbols: { code: string; symbol: string }[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private currencyService: CurrencyService) { }


  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.username = params['username'];
    });

    this.currencyService.getAdminProfile().subscribe({
      next: (profile) => {
        this.selectedCurrency = profile.currency || 'NIS';
      },
      error: (err) => {
        console.error('Error fetching admin profile:', err);
      }
    });

    this.currenciesWithSymbols = this.currencies.map(currencyCode => ({
      code: currencyCode,
      symbol: this.getCurrencySymbol(currencyCode)
    }));
  }

  getCurrencySymbol(currencyCode: string): string {
    return this.currencySymbols[currencyCode] || currencyCode;
  }
  get selectedCurrencySymbol(): string {
    return this.currencySymbols[this.selectedCurrency] || '';
  }


  onCurrencySelect(): void {

    if (this.selectedCurrency) {
      this.currencyService.setCurrency(this.selectedCurrency).subscribe({
        next: () => {
          this.router.navigate(['#']);
        },
        error: (err) => {
          console.error('Failed to update currency on the backend:', err);
        },
      });
    } else {
      console.log('No currency selected.');
    }
  }


  capitalizeFirstLetter(value: string): string {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
