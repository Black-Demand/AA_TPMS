import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { MatTableDataSource } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { SharedServiceService } from '../../services/shared/shared-service.service';
import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
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

interface Driver {
  id: string;
  fullName: string;
  licenseId: string;
  issuerRegion: string;
  issuerCity: string;
  issuerDate: Date;
}



@Component({
  selector: 'app-penalty-driver',
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
  templateUrl: './penalty-driver.component.html',
  styleUrl: './penalty-driver.component.css'
})
export class PenaltyDriverComponent {

  
   // Search Form
   searchForm!: FormGroup;
   searchType: 'name' | 'license' = 'name';
   showResults = false;
 
   // Ethiopian regions
   regions = [
     { code: 'AA', name: 'Addis Ababa' },
     { code: 'AM', name: 'Amhara' },
     { code: 'AF', name: 'Afar' },
     { code: 'OR', name: 'Oromia' },
     { code: 'SN', name: 'Southern Nations' },
     { code: 'TG', name: 'Tigray' },
     { code: 'SM', name: 'Somali' }
   ];
 
   licenseLevels = [
     { code: '1', name: 'Motor' },
     { code: '2', name: 'Taxi' },
     { code: '3', name: 'Public Transport' },
     { code: '4', name: 'Level 4' },
     { code: '5', name: 'Level 5' }
   ];
 
   // Results Table
   displayedColumns: string[] = ['fullName', 'licenseId', 'issuerRegion', 'issuerCity', 'issuerDate', 'actions'];
   dataSource = new MatTableDataSource<Driver>();
 
   constructor(private fb: FormBuilder,
    private sharedData: SharedServiceService)
     {
     this.createForm();
   }
 
   createForm(): void {
     this.searchForm = this.fb.group({
       searchType: ['name'],
       // Name fields
       firstName: ['', Validators.required],
       fatherName: ['', Validators.required],
       grandfatherName: ['', Validators.required],
       // License fields
       region: [''],
       level: [''],
       licenseNumber: ['']
     });
 
     this.toggleValidators();
   }
 
   onSearchTypeChange(event: MatRadioChange): void {
     this.searchType = event.value;
     this.toggleValidators();
   }
 
  navigateToPenaltyForm(driver: any) {
    this.sharedData.setDriverData({
      fullName: driver.fullName,
      licenseId: driver.licenseId
    });
    this.router.navigate(['/penality']);
  }

   toggleValidators(): void {
     const nameControls = ['firstName', 'fatherName', 'grandfatherName'];
     const licenseControls = ['region', 'level', 'licenseNumber'];
 
     if (this.searchType === 'name') {
       licenseControls.forEach(control => {
         this.searchForm.get(control)?.clearValidators();
         this.searchForm.get(control)?.reset();
         this.searchForm.get(control)?.updateValueAndValidity();
       });
       nameControls.forEach(control => {
         this.searchForm.get(control)?.setValidators([Validators.required]);
         this.searchForm.get(control)?.updateValueAndValidity();
       });
     } else {
       nameControls.forEach(control => {
         this.searchForm.get(control)?.clearValidators();
         this.searchForm.get(control)?.reset();
         this.searchForm.get(control)?.updateValueAndValidity();
       });
       licenseControls.forEach(control => {
         this.searchForm.get(control)?.setValidators([Validators.required]);
         this.searchForm.get(control)?.updateValueAndValidity();
       });
     }
   }
 
   onSubmit(): void {
     if (this.searchForm.invalid) {
       return;
     }
 
     // Simulate API call - replace with actual service call
     const searchParams = this.searchForm.value;
     console.log('Searching with:', searchParams);
     
     // Mock data - replace with actual API response
     const mockResults: Driver[] = [
       {
         id: '1',
         fullName: `${this.searchForm.value.firstName || ''} ${this.searchForm.value.fatherName || ''} ${this.searchForm.value.grandfatherName || ''}`.trim(),
         licenseId: this.searchType === 'license' 
           ? `${this.searchForm.value.region}-${this.searchForm.value.level}-${this.searchForm.value.licenseNumber}`
           : 'AA-3-1234567',
         issuerRegion: this.searchType === 'license' 
           ? this.regions.find(r => r.code === this.searchForm.value.region)?.name || 'Addis Ababa'
           : 'Addis Ababa',
         issuerCity: 'Addis Ababa',
         issuerDate: new Date()
       }
     ];
 
     this.dataSource.data = mockResults;
     this.showResults = true;
   }
  
   private router = inject(Router);

   onNext(driver: Driver): void {
     console.log('Proceeding with driver:', driver);
     // Navigate to next form or perform action
   }
 
   formatDate(date: Date): string {
     return date.toLocaleDateString('en-US', {
       year: 'numeric',
       month: 'short',
       day: 'numeric'
     });
   }
 
   resetForm(): void {
     this.searchForm.reset();
     this.createForm();
     this.showResults = false;
   }

}
