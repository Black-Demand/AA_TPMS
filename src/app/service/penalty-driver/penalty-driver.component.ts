import { Component, inject, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { MatTableDataSource } from '@angular/material/table';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { CommonModule, formatDate } from '@angular/common';
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
import { MatMenuModule } from '@angular/material/menu';
import { filter } from 'rxjs';
import { LanguageService } from '../../services/language.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
interface Driver {
  mainGuid: string;
  fullName: string;
  issuerRegion: string;
  issuerCity: string;
  licenseNumber: string;
  issuanceDate: string;
  licenseCategory?: number;
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
    MatCardModule,
    MatRadioModule,
    MatTableModule,
    MatPaginatorModule,
    MatStepperModule,
    MatTabsModule,
    MatIconModule,
    MatMenuModule,
    TranslateModule,
  ],
  standalone: true,
  templateUrl: './penalty-driver.component.html',
  styleUrl: './penalty-driver.component.css',
})
export class PenaltyDriverComponent {
  // Search Form
  searchForm!: FormGroup;
  searchType: 'license' | 'name' = 'license';
  showResults = false;
  licenseAreas: Lookup.LicenceAreaDTO[] = [];
  licenseRegions: Lookup.LicenceRegionDTO[] = [];
  licenseLevels: Lookup.LicenceCategoryDTO[] = [];
  selectedDriver: any;
  action: 'penalty' | 'suspension' = 'penalty'; // default
  currentUrl!: string;

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
    private licenceLookupService: LookupService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private languageService: LanguageService,
    private translate: TranslateService
  ) {
    this.createForm();
  }
  ngOnInit(): void {
    const currentLang = this.languageService.getCurrentLang();

    this.route.queryParams.subscribe((params) => {
      console.log('Query Params:', params);
      this.action =
        params['action'] === 'suspension' ? 'suspension' : 'penalty';
      console.log('Action set to:', this.action);
      console.log('Current URL:', window.location.href);
    });

    this.loadRegions();
    this.loadCategories();

    this.searchForm
      .get('region')
      ?.valueChanges.subscribe((regionCode: number) => {
        if (regionCode) {
          this.loadLicenseAreas(regionCode);
        }
      });
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

  private loadLicenseAreas(code: number): void {
    this.licenceLookupService.getAllAreas(code).subscribe({
      next: (data) => (this.licenseAreas = data),
      error: (err) => console.error('Failed to load license areas', err),
    });
  }

  createForm(): void {
    this.searchForm = this.fb.group({
      searchType: ['license'],
      firstName: ['', Validators.required],
      fatherName: [''],
      grandName: [''],
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
  const nameControls = ['firstName', 'fatherName', 'grandName'];
  const licenseControls = ['region', 'level', 'licenseNumber'];

  const allControls = [...nameControls, ...licenseControls];

  // Clear validators and errors for all fields
  allControls.forEach(control => {
    const formControl = this.searchForm.get(control);
    if (formControl) {
      formControl.clearValidators();
      formControl.setErrors(null); // Remove any existing error
      formControl.updateValueAndValidity();
    }
  });

  if (this.searchType === 'name') {
    this.searchForm.get('firstName')?.setValidators(Validators.required);
  } else {
    licenseControls.forEach(control => {
      this.searchForm.get(control)?.setValidators(Validators.required);
    });
  }

  // Re-validate only the relevant fields
  const activeControls = this.searchType === 'name' ? ['firstName'] : licenseControls;
  activeControls.forEach(control => {
    this.searchForm.get(control)?.updateValueAndValidity();
  });
}
onSubmit(): void {
  let relevantFields: string[] = [];

  if (this.searchType === 'license') {
    relevantFields = ['region', 'level', 'licenseNumber'];
  } else {
    relevantFields = ['firstName']; // only firstName is required
  }

  // Mark relevant fields as touched and validate them
  let hasError = false;
  relevantFields.forEach(field => {
    const control = this.searchForm.get(field);
    control?.markAsTouched();
    control?.updateValueAndValidity();
    if (control?.invalid) {
      hasError = true;
    }
  });

  if (hasError) {
    return;
  }

  const formValue = this.searchForm.value;

  if (this.searchType === 'license') {
    this.driverService
      .searchByLicense(
        formValue.region,
        formValue.level,
        formValue.licenseNumber
      )
      .subscribe({
        next: (driver) => {
          const mapped = this.mapDtoToDriver(driver);
          this.dataSource.data = [mapped];
          this.selectedDriver = mapped;
          this.showResults = true;
        },
        error: () => {
          this.toastr.error(this.translate.instant('TOASTER.ERROR.NOT_FOUND'));
          this.dataSource.data = [];
          this.selectedDriver = null;
          this.showResults = false;
        },
      });
  } else {
    this.driverService
      .searchByName(
        formValue.firstName,
        formValue.fatherName,
        formValue.grandName
      )
      .subscribe({
        next: (drivers) => {
          const mappedDrivers = drivers.map(d => this.mapDtoToDriver(d));
          this.dataSource.data = mappedDrivers;
          this.selectedDriver = mappedDrivers[0];
          this.showResults = true;
        },
        error: () => {
          this.toastr.error(this.translate.instant('TOASTER.ERROR.NOT_FOUND'));
          this.dataSource.data = [];
          this.selectedDriver = null;
          this.showResults = false;
        },
      });
  }
}


  // private mapDtoToDriver(dto: DriverDTO): Driver {
  //   return {
  //     mainGuid: dto.mainGuid,
  //     fullName: `${dto.firstName} ${dto.fatherName} ${dto.grandName}`.trim(),
  //     issuerRegion: dto.licenceRegion
  //       ? this.getRegionName(dto.licenceRegion)
  //       : 'Unknown',
  //     issuerCity: dto.licenceArea
  //       ? this.getCityName(dto.licenceArea)
  //       : 'Unknown',
  //     issuanceDate: dto.issuanceDate || '',
  //     licenseNumber: dto.licenceNo?.trim() || '',
  //     licenseCategory: dto.licenceGrade != null ? +dto.licenceGrade : undefined,
  //   };
  // }

  private mapDtoToDriver(dto: DriverDTO): Driver {
    return {
      mainGuid: dto.mainGuid,
      fullName: [dto.firstName, dto.fatherName, dto.grandName]
        .filter(Boolean)
        .join(' ')
        .trim(),
      issuerRegion: dto.licenceRegion
        ? this.getRegionName(dto.licenceRegion)
        : 'Unknown',
      issuerCity: dto.licenceArea
        ? this.getCityName(dto.licenceArea)
        : 'Unknown',
      issuanceDate: dto.issuanceDate || '',
      licenseNumber: dto.licenceNo?.trim() || '',
      licenseCategory: dto.licenceGrade != null ? +dto.licenceGrade : undefined,
    };
  }

  private getRegionName(code: string): string {
    return (
      this.licenseRegions.find((r) => r.code === code)?.amDescription || code
    );
  }

private getCityName(code: string): string {
  const matched = this.licenseAreas.find(
    (c) => c.code.toString().trim() === code.toString().trim()
  );
  console.log(this.licenseAreas);
  return matched?.amDescription || code;
} 


  // navigateToPenaltyForm(driver: any, action: 'penalty' | 'suspension') {
  //   this.driverService.setDriverData({
  //     fullName: driver.fullName,
  //     licenseNumber: driver.licenseNumber,
  //     mainGuid: driver.mainGuid,
  //   });
  //   // this.router.navigate(['/penality']);
  //   if (action === 'penalty') {
  //     this.router.navigate(['/penality']);
  //   } else if (action === 'suspension') {
  //     this.router.navigate(['form', driver.mainGuid], {
  //       relativeTo: this.route,
  //     });
  //   }
  // }
  // navigateToNext(driver: any, action: 'penalty' | 'suspension') {
  //   this.driverService.setDriverData({
  //     fullName: driver.fullName,
  //     licenseNumber: driver.licenseNumber,
  //     mainGuid: driver.mainGuid
  //   });

  //   if (action === 'penalty') {
  //     this.router.navigate(['/penality']);
  //   } else if (action === 'suspension') {
  //       this.router.navigate(['/suspension-form', driver.mainGuid]);
  //   }
  // }

  navigateToNext(driver: any) {
    this.driverService.setDriverData({
      fullName: driver.fullName,
      licenseNumber: driver.licenseNumber,
      mainGuid: driver.mainGuid,
    });

    // if (this.currentUrl === 'penalty') {
    this.router.navigate(['/penality']);
    // } else {
    //   console.log('Navigating to suspension-search with action=suspension');

    // this.router.navigate(['/suspension-search']);
    // }
  }

  onNext(driver: Driver): void {
    console.log('Proceeding with driver:', driver);
  }

  formatDate(value: Date | string | null, format = 'yyyy-MM-dd'): string {
    if (!value) return '';
    try {
      return formatDate(value, format, 'en-US');
    } catch {
      return '';
    }
  }

  resetForm(): void {
    this.searchForm.reset();
    this.showResults = false;
  } 
}
