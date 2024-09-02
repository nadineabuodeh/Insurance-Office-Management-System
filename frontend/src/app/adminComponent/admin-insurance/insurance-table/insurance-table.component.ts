import { Component, OnInit } from '@angular/core';
import { Insurance } from '../../../model/insurance.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { InsuranceService } from '../../../service/insurance.service';
import { MatDialog } from '@angular/material/dialog';
import { InsuranceFormComponent } from '../inurance-form/insurance-form.component';

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
    public dialog: MatDialog
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
        this.loadInsurances(); // This refreshes the table data after adding a new insurance
      }
    });
  }

  deleteInsurance(id: number): void {
    if (confirm('Are you sure you want to delete this insurance?')) {
      this.insuranceService.deleteInsurance(id).subscribe(
        () => this.loadInsurances(),
        (error) => console.error('Error deleting insurance:', error)
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
        this.insuranceService.updateInsurance(insurance.id!, result).subscribe(
          () => this.loadInsurances(),
          (error) => console.error('Error updating insurance:', error)
        );
      }
    });
  }
}
