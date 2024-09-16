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
import { AdminService } from '../../service/admin.service';
import { Admin } from '../../model/admin';
import { MatDialog } from '@angular/material/dialog';
import { LoadingService } from '../../service/loading.service';
import { AdminFormComponent } from '../admin-form/admin-form.component';

@Component({
  selector: 'app-admin-details',
  standalone: true,
  imports: [NgClass, CommonModule, MatFormFieldModule,
    MatInputModule, FormsModule,
    MatButtonModule, MatOptionModule, MatSelectModule], templateUrl: './admin-details.component.html',
  styleUrl: './admin-details.component.css'
})
export class AdminDetailsComponent implements OnInit {
  username: string | undefined;
  admin: Admin | undefined;

  constructor(private adminService: AdminService,
    public dialog: MatDialog, private loadingService: LoadingService, private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.fetchAdminProfile();

    const adminId = this.authService.getAdminId();
    if (adminId) {
      console.log("Admin ID ------> " + adminId)
    }
    this.route.queryParams.subscribe(params => {
      this.username = params['username'];
    });
  }

  fetchAdminProfile(): void {
    this.adminService.getAdminProfile().subscribe({
      next: (data) => {
        this.admin = data;
      },
      error: (err) => {
        console.error('Error fetching admin profile:', err);
      }
    });
  }

  editAdmin(admin: Admin): void {
    const dialogRef = this.dialog.open(AdminFormComponent, {
      panelClass: 'custom-dialog-container',
      data: { admin }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("Dialog closed with result:", result);
        this.loadingService.loadingOn();
        this.adminService.updateAdminProfile(admin.id, result).subscribe({
          next: () => {
            this.loadingService.loadingOff();
            this.fetchAdminProfile();
          },
          error: (err) => {
            this.loadingService.loadingOff();
            console.error('Error updating admin:', err);
          }
        });
      }
    });
  }


  capitalizeFirstLetter(value: string): string {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

}
