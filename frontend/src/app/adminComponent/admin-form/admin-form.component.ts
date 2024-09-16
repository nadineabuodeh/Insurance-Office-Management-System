import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { LoadingService } from '../../service/loading.service';
import { AdminService } from '../../service/admin.service';
import { Admin } from '../../model/admin';
import { AdminFormFieldsComponent } from '../admin-form-fields/admin-form-fields.component';

@Component({
  selector: 'app-admin-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule, AdminFormFieldsComponent
  ], templateUrl: './admin-form.component.html',
  styleUrl: './admin-form.component.css'
})
export class AdminFormComponent {
  adminForm: FormGroup;
  admins: Admin[] = [];
  adminName: string = '';

  existingAdminData: any;


  private initialFormValue: any;
  private subscription: Subscription = new Subscription();
  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private dialogRef: MatDialogRef<AdminFormComponent>,
    private loadingService: LoadingService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {


    this.adminForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: [{ value: '', disabled: true }],
      idNumber: [{ value: '', disabled: true }],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      currency: ['', Validators.required],
    });

    this.dialogRef.disableClose = true;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadAdmins(): void {
    this.subscription.add(
      this.adminService.getAdminProfile().subscribe((admins) => {
        if (Array.isArray(admins)) {
          this.admins = admins;
        } else {
          this.admins = [];
        }
      })
    );
  }


  ngOnInit() {
    if (this.data && this.data.admin) {
      this.initialFormValue = this.data.admin;
      this.adminForm.patchValue(this.data.admin);
      this.adminName = `${this.data.admin.firstName} ${this.data.admin.lastName}`;
      console.log("admin name -> " + this.adminName)
    }
    this.loadAdmins();

  }


  onSubmit() {
    if (this.adminForm.valid) {
      const adminData: Admin = this.adminForm.value;


      if (this.isFirstNameDuplicate(adminData.username)) {
        this.adminForm.get('firstName')?.setErrors({ duplicate: true });
        return;
      }

      if (this.isEmailDuplicate(adminData.email)) {
        this.adminForm.get('email')?.setErrors({ duplicate: true });
        return;
      }

      if (this.isPhoneNumberDuplicate(adminData.phoneNumber)) {
        this.adminForm.get('phoneNumber')?.setErrors({ duplicate: true });
        return;
      }

      if (this.isUserNameDuplicate(adminData.username)) {
        this.adminForm.get('username')?.setErrors({ duplicate: true });
        return;
      }

      this.loadingService.loadingOn();

      this.adminService
        .updateAdminProfile(this.data.admin.id, adminData)
        .subscribe(
          () => {
            this.loadingService.loadingOff();
            this.dialogRef.close(adminData);
          },
          () => {
            this.loadingService.loadingOff();
          }
        );
    }
  }


  isFirstNameDuplicate(firstName: string): boolean {
    return this.admins.some(
      (admin) =>
        admin.firstName === firstName &&
        (admin.id !== this.initialFormValue.id)
    );
  }


  isEmailDuplicate(email: string): boolean {
    return Array.isArray(this.admins) && this.admins.some(
      (admin) =>
        admin.email === email &&
        (admin.id !== this.initialFormValue.id)
    );
  }

  isUserNameDuplicate(username: string): boolean {
    return Array.isArray(this.admins) && this.admins.some(
      (admin) =>
        admin.username === username &&
        (admin.id !== this.initialFormValue.id)
    );
  }

  isPhoneNumberDuplicate(phoneNumber: string): boolean {
    return Array.isArray(this.admins) && this.admins.some(
      (admin) =>
        admin.phoneNumber === phoneNumber &&
        (admin.id !== this.initialFormValue.id)
    );
  }


}
