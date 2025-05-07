import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { dateCannotBeTheFuture, minAgeValidator } from '../age.validate';

// Material Modules
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
import { ReactiveFormsModule } from '@angular/forms';
import Lookup from '../../Models/lookup';
import { privateDecrypt } from 'crypto';
import { LookupService } from '../../services/lookup.service';
import { Gender, GenderDescriptions } from '../../Enums/gender';
import { DriverDTO } from '../../Models/driver';
import { TempDriverService } from '../../services/temp-driver.service';

@Component({
  selector: 'app-temporary-registraion',
  standalone: true,
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
  templateUrl: './temporary-registraion.component.html',
  styleUrls: ['./temporary-registraion.component.css']
})
export class TemporaryRegistraionComponent implements OnInit {

  registrationForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  selectedPhotoFile: File | null = null;

  
  
  genderEnum = Gender;
  genderOptions = [
    { value: Gender.Male, label: GenderDescriptions[Gender.Male] },
    { value: Gender.Female, label: GenderDescriptions[Gender.Female] }
  ];  regions: Lookup.RegionDTO[] = [];
  zones: Lookup.ZoneDTO[] = [];
  woredas: Lookup.WoredaDTO[] = [];
  kebeles: Lookup.KebeleDTO[] = [];
  licenceRegions: Lookup.LicenceRegionDTO[] = [];
  licenceAreas: Lookup.LicenceAreaDTO[] = [];
  licenceCatagories: Lookup.LicenceCategoryDTO[] = [];
  nationalities: Lookup.LookupDTO[] = [];

  selectedRegionCode!: number;
  selectedZoneCode!: number;
  selectedWoredaCode!: number;
  selectedLicenceRegionCode: number = 0;



  

  constructor(
    private fb: FormBuilder,
    private tdrs: TempDriverService,
    private lookupservice: LookupService
    
  ) {
    this.registrationForm = this.fb.group({
      licenceRegion: ['', Validators.required],
      licenceArea: ['', Validators.required],
      licenceGrade: ['', Validators.required],
      licenceNo: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      issuanceDate: ['', [Validators.required, dateCannotBeTheFuture()]],      
      firstNameAmh: ['', Validators.required],
      fatherNameAmh: ['', Validators.required],
      grandNameAmh: ['', Validators.required],      
      firstName: ['', Validators.required],
      fatherName: ['', Validators.required],
      grandName: ['', Validators.required],      
      nationality: ['', Validators.required],
      sex: ['', Validators.required],
      birthDate: ['', [Validators.required, minAgeValidator(18)]],
      tel1: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],      
      region: ['', Validators.required],
      zone: ['', Validators.required],
      woreda: ['', Validators.required],
      kebele: ['', Validators.required],
      houseNo: [''],
      remark: [''],      
      // photo: [null, Validators.required]
    });
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove non-digit characters
    
    // Ensure we don't exceed max length
    if (value.length > 9) {
      value = value.substring(0, 9);
    }
    
    input.value = value;
    this.registrationForm.get('phone')?.setValue(value, { emitEvent: false });
  }

  getFullPhoneNumber(): string {
    const phoneControl = this.registrationForm.get('phone');
    return phoneControl?.value ? `+251${phoneControl.value}` : '';
  }

  get licenseNumberControl() {
    return this.registrationForm.get('licenseNumber');
  }

  getErrorForLicenseNumber(): string {
    if (this.licenseNumberControl?.hasError('required')) {
      return 'Driver\'s License Number is required';
    }
    if (this.licenseNumberControl?.hasError('minlength') || 
        this.licenseNumberControl?.hasError('maxlength')) {
      return 'Must be exactly 6 characters';
    }
    return '';
  }

  getErrorForIssueDate(): string {
    const field = this.registrationForm.get('issuanceDate');
  
    if (field?.hasError('required')) {
      return 'The issue date is required';
    }
  
    if (field?.hasError('dateCannotBeTheFuture')) {
      return 'Issue date cannot be in the future';
    }
  
    return '';
  }

  ngOnInit(): void {
    this.loadRegions();
    this.loadCategories();
    this.loadLicenceRegions();
    this.loadNationality();
  }
   
  onRegionChange(regionCode: number) {
    this.selectedRegionCode = regionCode; // store if needed
    this.loadZones(regionCode);
  }
  
  onZoneChange(zoneCode: number) {
    console.log('Zone changed:', zoneCode); // Check this in the browser console
    this.selectedZoneCode = zoneCode;
    this.loadWoredas(zoneCode);
  }
  

  onWoredaChange(woredaCode: number) {
    console.log('Woreda changed:', woredaCode);
    this.selectedWoredaCode = woredaCode;
    this.loadKebeles(woredaCode);
  }
  


  loadRegions() {
    this.lookupservice.getRegions().subscribe(data => {
      this.regions = data;
      this.zones = [];
      this.woredas = [];
      this.kebeles = [];
    });
  }
  
  loadZones(regionCode: number) {
    this.lookupservice.getZonesByRegion(regionCode).subscribe(data => {
      this.zones = data;
      this.woredas = [];
      this.kebeles = [];
    });
  }
  
  loadWoredas(zoneCode: number) {
    this.lookupservice.getWoredasByZone(zoneCode).subscribe(data => {
      this.woredas = data;
      this.kebeles = [];
    });
  }
  
  
  loadKebeles(woredaCode: number) {
    this.lookupservice.getKebelesByWoreda(woredaCode).subscribe(data => {
      this.kebeles = data;
    });
  }

  loadLicenceRegions(): void {
    this.lookupservice.getAllRegions().subscribe(data => {
      console.log('Loaded Regions:', data);
      this.licenceRegions = data;
    });
  }
  onIssuerRegionChange(regionCode: number): void {
    console.log('Selected Region Code:', regionCode); // Should NOT be undefined
    if (regionCode != null) {
      this.selectedLicenceRegionCode = regionCode;
      this.loadAreasByLicenceRegion(regionCode);
    }
  }
  
  loadAreasByLicenceRegion(regionCode: number): void {
    this.lookupservice.getAllAreas(regionCode).subscribe(data => {
      this.licenceAreas = data;
    });
  }
  
  

  loadCategories() {
    this.lookupservice.getAllCategories().subscribe(data => {
      this.licenceCatagories = data;
    })
  }
  loadNationality() {
    this.lookupservice.getAllLookups().subscribe(
      data => {
        this.nationalities = data;
      },
      error => {
        console.error('Error fetching categories:', error);
      }
    );
  }



  

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file type
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        this.registrationForm.get('photo')?.setErrors({ fileType: true });
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.registrationForm.get('photo')?.setErrors({ fileSize: true });
        return;
      }
      
      // Update form control
      this.selectedPhotoFile = file;
      this.registrationForm.patchValue({ photo: file });
      this.registrationForm.get('photo')?.updateValueAndValidity();
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    console.log(this.registrationForm.value);
  
    if (this.registrationForm.valid) {
      const driver: DriverDTO = this.registrationForm.value;
  
      this.tdrs.createDriver(driver).subscribe({
        next: (response) => {
          alert('Driver created successfully');
          this.onReset(); 
        },
        error: (err) => {
          console.error('Error creating driver:', err);
          alert('Error: ' + (err.error?.message || err.message || 'Unknown error'));
        }
      });
    } else {
      this.registrationForm.markAllAsTouched(); // Highlight validation errors
    }
  }
  
  
  onReset(): void {
    this.registrationForm.reset();
    this.imagePreview = null;
    this.selectedPhotoFile = null;
  }
}