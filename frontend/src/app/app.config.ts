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
import { CustomerTableRowComponent } from './adminComponent/admin-customer/customer-table-row/customer-table-row.component';
import { CustomerService } from './service/customer.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideClientHydration(), HttpClientModule,
    provideHttpClient(), provideHttpClient(withFetch())
    ,importProvidersFrom(
      MatFormFieldModule,
      MatInputModule,
      BrowserAnimationsModule, //****************/
      MatButtonModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatTableModule,
      MatDialogModule,
      FormsModule,
      ReactiveFormsModule,

      CookieService
    ),
      CustomerService
      , CustomerTableRowComponent]
};