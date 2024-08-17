import { Component, Input } from '@angular/core';
import { FormGroup,FormBuilder,Validator, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog'; 
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-form-fields',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,  ReactiveFormsModule, 
    MatDatepickerModule,
    MatButtonModule,MatDialogModule
  ],
  templateUrl: './customer-form-fields.component.html',
  styleUrls: ['./customer-form-fields.component.css']
})
export class CustomerFormFieldsComponent {
  @Input() formGroup!: FormGroup;

  constructor() {}
 

}
