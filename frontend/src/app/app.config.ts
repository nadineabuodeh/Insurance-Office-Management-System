import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { routes } from './app.routes';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerService } from './service/CustomerService/customer.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TreeModule } from 'primeng/tree';
import { TransactionService } from './service/TransactionService/transaction.service';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
  provideClientHydration(), HttpClientModule, provideClientHydration(),
  provideHttpClient(), provideHttpClient(withFetch())
    , importProvidersFrom(
      MatFormFieldModule,
      MatInputModule,
      BrowserAnimationsModule, //****************/
      MatButtonModule,
      MatDatepickerModule,
      MatNativeDateModule,MatFormFieldModule,
      MatTableModule,
      MatDialogModule,
      FormsModule, TreeModule,
      ReactiveFormsModule,

      CookieService
    ),
    CustomerService,TransactionService
    ]
};