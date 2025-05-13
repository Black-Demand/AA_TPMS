import { Component, inject, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { MatTableDataSource } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
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
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { TempDriverService } from '../../services/temp-driver.service';
import { DriverDTO } from '../../Models/driver';
import Lookup from '../../Models/lookup';
import { LookupService } from '../../services/lookup.service';
import { ToastrService } from 'ngx-toastr';

interface Driver {
  fullName: string;
  issuerRegion: string;
  issuerCity: string;
  licenseNumber: string;
  issuerDate: string;
}

@Component({
  selector: 'app-driver-info',
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
    MatTabsModule,
  ],
  templateUrl: './driver-info.component.html',
  styleUrl: './driver-info.component.css'
})
export class DriverInfoComponent {
  searchForm!: FormGroup;
  searchType: 'name' | 'license' = 'name';
  showResults = false;
  licenseAreas: Lookup.LicenceAreaDTO[] = [];
  licenseRegions: Lookup.LicenceRegionDTO[] = [];
  licenseLevels: Lookup.LicenceCategoryDTO[] = [];

  // Results Table
  displayedColumns: string[] = [
    'fullName',
    'licenseNumber',
    'issuerRegion',
    'issuerCity',
    'issuerDate',
    'actions',
  ];
  dataSource = new MatTableDataSource<Driver>();

  constructor(
    private fb: FormBuilder,
    private driverService: TempDriverService,
    private licenceLookupService: LookupService, // <-- Inject your service
    private router: Router,
    private toastr: ToastrService
    
  ) // <-- Add this line
  {
    this.createForm();
  }
  ngOnInit(): void {
    this.loadRegions();
    this.loadCategories();

    this.searchForm.get('region')?.valueChanges.subscribe((regionCode: number) => {
      if (regionCode) {
        this.loadLicenseAreas(regionCode);
      }
    })    
  }

  private loadRegions(): void {
    this.licenceLookupService.getAllRegions().subscribe({
      next: (data) => (this.licenseRegions = data),
      error: (err) => console.error('Failed to load regions', err),
    });
  }

  private loadCategories(): void {
    this.licenceLookupService.getAllCategories().subscribe({
      next: (data) => (this.licenseLevels = data),
      error: (err) => console.error('Failed to load categories', err),
    });
  }

  
  private loadLicenseAreas(code : number): void {
    this.licenceLookupService.getAllAreas(code).subscribe({
      next: (data) => (this.licenseAreas = data),
      error: (err) => console.error('Failed to load license areas', err),
    });
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
      licenseNumber: [''],
    });

    this.toggleValidators();
  }

  onSearchTypeChange(event: MatRadioChange): void {
    this.searchType = event.value;
    this.toggleValidators();
  }

  toggleValidators(): void {
    const nameControls = ['firstName', 'fatherName', 'grandfatherName'];
    const licenseControls = ['region', 'level', 'licenseNumber'];

    if (this.searchType === 'name') {
      licenseControls.forEach((control) => {
        this.searchForm.get(control)?.clearValidators();
        this.searchForm.get(control)?.reset();
        this.searchForm.get(control)?.updateValueAndValidity();
      });
      nameControls.forEach((control) => {
        this.searchForm.get(control)?.setValidators([Validators.required]);
        this.searchForm.get(control)?.updateValueAndValidity();
      });
    } else {
      nameControls.forEach((control) => {
        this.searchForm.get(control)?.clearValidators();
        this.searchForm.get(control)?.reset();
        this.searchForm.get(control)?.updateValueAndValidity();
      });
      licenseControls.forEach((control) => {
        this.searchForm.get(control)?.setValidators([Validators.required]);
        this.searchForm.get(control)?.updateValueAndValidity();
      });
    }
  }




  onSubmit(): void {
    if (this.searchForm.invalid) {
      return;
    }
  
    const formValue = this.searchForm.value;
  
    if (this.searchType === 'name') {
      this.driverService
        .searchByName(
          formValue.firstName,
          formValue.fatherName,
          formValue.grandfatherName
        )
        .subscribe({
          next: (driver) => {
            this.dataSource.data = [this.mapDtoToDriver(driver)];
            this.showResults = true;
          },
          error: (err) => {
            console.error('Search by name failed:', err);
            this.dataSource.data = [];
            this.showResults = false;
             this.toastr.error('Search by name failed!!!', 'Error', {
                timeOut: 2000,
                progressBar: true
              });
          },
        });
    } else {
      this.driverService
        .searchByLicense(
          formValue.region,
          formValue.level,
          formValue.licenseNumber
        )
        .subscribe({
          next: (driver) => {
            this.dataSource.data = [this.mapDtoToDriver(driver)];
            this.showResults = true;
          },
          error: (err) => {
            console.error('Search by license failed:', err);
            this.dataSource.data = [];
            this.showResults = false;
             this.toastr.error('Search by license ID failed!!!', 'Error', {
                timeOut: 2000,
                progressBar: true
              });
          },
        });
    }
  }
  
  private mapDtoToDriver(dto: DriverDTO): Driver {
    return {
      fullName: `${dto.firstName} ${dto.fatherName} ${dto.grandName}`.trim(),
      issuerRegion: dto.licenceRegion ? this.getRegionName(dto.licenceRegion) : 'Unknown',
      issuerCity: dto.licenceArea ? this.getCityName(dto.licenceArea) : 'Unknown',
      issuerDate: dto.issuanceDate || '',  // Let formatter handle fallback
      licenseNumber: dto.licenceNo?.trim() || ''
    };
  }
  
  
  

  private getRegionName(code: string): string {
    return this.licenseRegions.find((r) => r.code === code)?.amDescription || code;
  }

  private getCityName(code: string) : string {
    return this.licenseAreas.find((c) => c.code === code)?.amDescription || code;
  }
  


  onNext(driver: Driver): void {
    console.log('Proceeding with driver:', driver);
    // Navigate to next form or perform action
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  resetForm(): void {
    this.searchForm.reset();
    this.createForm();
    this.showResults = false;
  }

}
