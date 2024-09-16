import { CommonModule, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CurrencyService } from '../../service/currency.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-admin-form-fields',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatButtonModule,
    MatDialogModule, MatOptionModule, FormsModule, NgClass, CommonModule, MatFormFieldModule,
    MatInputModule, FormsModule,
    MatButtonModule, MatOptionModule, MatSelectModule
  ], templateUrl: './admin-form-fields.component.html',
  styleUrl: './admin-form-fields.component.css'
})
export class AdminFormFieldsComponent {

  @Input() formGroup!: FormGroup;
  @Input() adminName: string = '';

  private initialFormValue: any;
  currencies = ['NIS', 'USD', 'EUR', 'JOD']
  selectedCurrency: string = 'NIS'
  username: string | undefined;
  currencySymbols: { [key: string]: string } = {
    NIS: '₪',
    USD: '$',
    EUR: '€',
    JOD: 'JOD',

  };
  currenciesWithSymbols: { code: string; symbol: string }[] = [];

  constructor(private dialog: MatDialog, private currencyService: CurrencyService) { }

  ngOnInit(): void {
    this.initialFormValue = this.formGroup.getRawValue();
    console.log("admin name - form field ->" + this.adminName)
    this.currencyService.getAdminProfile().subscribe({
      next: (profile) => {
        this.selectedCurrency = profile.currency;
        console.log('Currency from Backend -> ' + this.selectedCurrency);
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

  onCancel(): void {
    if (this.formGroup.dirty) {
      if (confirm('Are you sure you want to discard your changes?')) {
        this.formGroup.patchValue(this.initialFormValue);
        this.formGroup.markAsPristine();
        this.formGroup.markAsUntouched();

        this.formGroup.reset();
        this.dialog.closeAll();
      }
    } else {
      this.formGroup.reset();
      this.dialog.closeAll();
    }
  }
}
