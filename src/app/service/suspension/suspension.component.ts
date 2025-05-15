import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from "@angular/material/radio";
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { dateNotTheFutures } from '../date.validate';

interface SuspensionRecord {
  fullName: string;
  licenseNumber: string;
  blocked: string;
  regDate: Date;
  susDate: Date;
  susLevel: string;
  expDate: Date;
  letterNumber: string;
  reason: string;
}

@Component({
  selector: 'app-suspension',
    imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatRadioModule,
    MatTableModule,
    MatPaginatorModule,
    MatStepperModule,
    MatTabsModule
  ],
  templateUrl: './suspension.component.html',
  styleUrls: ['./suspension.component.css']
})
export class SuspensionComponent implements OnInit {
   penaltyForm: FormGroup;
  codes = ['Temporary', 'Fixed'];
  showExpirationDate = false;

  // Table properties
  displayedColumns: string[] = ['blocked', 'regDate', 'letterNumber', 'susDate', 'susLevel', 'status'];
  dataSource: MatTableDataSource<SuspensionRecord>;
  suspensions: SuspensionRecord[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

    constructor(private fb: FormBuilder) {
    this.penaltyForm = this.fb.group({
      fullName: [{value: '', disabled:true}, Validators.required],
      licenseNumber: [{value: '', disabled:true}, Validators.required],
      blocked: ['', Validators.required],
      regDate:  ['', [Validators.required, dateNotTheFutures()]],
      susDate: ['', [Validators.required, dateNotTheFutures()]],
      susLevel: ['', Validators.required],
      expDate: [''], // Removed required validator since it's conditional
      letterNumber: ['', Validators.required],
      reason: ['', Validators.required],
    });

    // Initialize table data source
    this.dataSource = new MatTableDataSource(this.suspensions);
  }

  ngOnInit(): void {
    // Load initial data or from service
   
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onSubmit(): void {
    if (this.penaltyForm.valid) {
      const newSuspension: SuspensionRecord = this.penaltyForm.value;
      this.suspensions.push(newSuspension);
      this.dataSource.data = this.suspensions;
    }
  }

  onReset(): void {
    this.penaltyForm.reset();
  }

  isActive(suspension: SuspensionRecord): boolean {
    return new Date(suspension.expDate) > new Date();
  }

onSuspensionLevelChange(): void {
    const level = this.penaltyForm.get('susLevel')?.value;
    this.showExpirationDate = level === 'Temporary';
    
  
    const expDateControl = this.penaltyForm.get('expDate');
    if (level === 'Temporary') {
      expDateControl?.setValidators(Validators.required);
    } else {
      expDateControl?.clearValidators();
      expDateControl?.reset(); 
    }
    expDateControl?.updateValueAndValidity();
  }

  getErrorForRegDate(): string{
    
    const field = this.penaltyForm.get('regDate');
    if(field?.hasError('required')){
        return 'Registration Date is required';
    }
    if(field?.hasError('dateNotTheFuture')){
       return field.getError('dateNotTheFuture').message;
    }
    return'';
  }

  getErrorForSupDate(): string{
     const field = this.penaltyForm.get('susDate');
    if(field?.hasError('required')){
        return 'Suspension Date is required';
    }
    if(field?.hasError('dateNotTheFuture')){
       return field.getError('dateNotTheFuture').message;
    }
    return'';
  }
  getErrorForExpDate(): string{
     const field = this.penaltyForm.get('expDate');
    if(field?.hasError('required')){
        return 'Expiration Date is required';
    }
    return'';
  }

}