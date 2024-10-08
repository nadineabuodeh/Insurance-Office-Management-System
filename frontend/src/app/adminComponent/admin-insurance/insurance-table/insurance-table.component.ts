import { Component, OnInit } from '@angular/core';
import { Insurance } from '../../../model/insurance.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { InsuranceService } from '../../../service/insurance.service';
import { MatDialog } from '@angular/material/dialog';
import { InsuranceFormComponent } from '../inurance-form/insurance-form.component';
import { LoadingService } from '../../../service/loading.service';

@Component({
  selector: 'app-insurance-table',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './insurance-table.component.html',
  styleUrl: './insurance-table.component.css',
})
export class InsuranceTableComponent implements OnInit {
  displayedColumns: string[] = ['insuranceType', 'description', 'actions'];
  dataSource = new MatTableDataSource<Insurance>();

  constructor(
    private insuranceService: InsuranceService,
    public dialog: MatDialog,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadInsurances();
  }

  loadInsurances(): void {
    this.insuranceService.getInsurances().subscribe(
      (data) => (this.dataSource.data = data),
      (error) => console.error('Error loading insurances:', error)
    );
  }

  onAddButtonClick(): void {
    const dialogRef = this.dialog.open(InsuranceFormComponent, {
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadInsurances();
      }
    });
  }

  deleteInsurance(id: number): void {
    if (confirm('Are you sure you want to delete this insurance?')) {
      this.loadingService.loadingOn();
      this.insuranceService.deleteInsurance(id).subscribe(
        () => {
          this.loadingService.loadingOff(); 
          this.loadInsurances();
        },
        (error) => {
          this.loadingService.loadingOff();
          console.error('Error deleting insurance:', error);
        }
      );
    }
  }

  editInsurance(insurance: Insurance): void {
    const dialogRef = this.dialog.open(InsuranceFormComponent, {
      panelClass: 'custom-dialog-container',
      data: { insurance },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadingService.loadingOn();
        this.insuranceService.updateInsurance(insurance.id!, result).subscribe(
          () => {
            this.loadingService.loadingOff();
            this.loadInsurances()
          },
          (error) => {
            this.loadingService.loadingOff();
            console.error('Error updating insurance:', error)
          }
        );
      }
    });
  }
  
}
