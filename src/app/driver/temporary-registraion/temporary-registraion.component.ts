import { Component, NgModule,inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TemporaryDriverRegistrationService } from '../../services/temporary-driver-registration.service';
import { TemporaryDriverRegistration } from '../../Models/TemporaryDriverRegistration';
import { dateCannotBeTheFuture, minAgeValidator } from '../age.validate';
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

@Component({
  selector: 'app-temporary-registraion',
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
  styleUrl: './temporary-registraion.component.css'
})
export class TemporaryRegistraionComponent implements OnInit{

  registrationForm: FormGroup;
  regions: string[] = [];
  issuerStations: string[] = [];
  licenseLevels: string[] = [];
  nationalities: string[] = [];
  genders: string[] = [];
  zones: string[] = [];
  districts: string[] = [];
  kebeles: string[] = [];
  imagePreview: string | ArrayBuffer | null = null;
  selectedPhotoFile: any;

  constructor(
    private fb: FormBuilder,
    private tdrs: TemporaryDriverRegistrationService
  ) {
    this.registrationForm = this.fb.group({
      // Issuer Information
      issuerRegion: ['', Validators.required],
      issuerStation: ['', Validators.required],
      licenseLevel: ['', Validators.required],
      
      // License Information
      licenseNumber: ['', Validators.required, Validators.maxLength(6), Validators.minLength(6)],
      issueDate: ['', [Validators.required, dateCannotBeTheFuture()]],
      
      // Personal Information (Amharic)
      nameAmharic: ['', Validators.required],
      fatherNameAmharic: ['', Validators.required],
      grandfatherNameAmharic: ['', Validators.required],
      
      // Personal Information (English)
      firstName: ['', Validators.required],
      fatherName: ['', Validators.required],
      grandfatherName: ['', Validators.required],
      
      // Personal Details
      nationality: ['', Validators.required],
      gender: ['', Validators.required],
      dateOfBirth: ['', [Validators.required, minAgeValidator(18)]],
      //dateOfBirth: ['', Validators.required],
      
      // Address Information
      region: ['', Validators.required],
      zone: ['', Validators.required],
      district: ['', Validators.required],
      kebele: ['', Validators.required],
      houseNumber: [''],
      remark: [''],
      
      // Photo
      photo: [null, Validators.required]
    });
  }

  get licenseNumber() {
    return this.registrationForm.get('licenseNumber');
  }

  getLicenseError() {
    if (this.licenseNumber?.hasError('required')) {
      return 'Driver\'s License Number is required';
    }
    if (this.licenseNumber?.hasError('minlength') || 
        this.licenseNumber?.hasError('maxlength')) {
      return 'Must be exactly 6 characters';
    }
    return '';
  }

  getErrorForIssueDate(): string {
    const field = this.registrationForm.get('issueDate');
  
    if (field?.hasError('required')) {
      return 'The issue date is required';
    }
  
    if (field?.hasError('dateCannotBeTheFuture')) {
      return field.getError('dateCannotBeTheFuture').message;
    }
  
    return '';
  }
  

  ngOnInit(): void {
    this.loadDropdownData();
  }

  loadDropdownData(): void {
    this.tdrs.getRegions().subscribe(regions => this.regions = regions);
    this.tdrs.getLicenseLevels().subscribe(levels => this.licenseLevels = levels);
    this.tdrs.getNationalities().subscribe(countries => this.nationalities = countries);
    this.tdrs.getGenders().subscribe(genders => this.genders = genders);
  }

  updateIssuerStations(): void {
    const region = this.registrationForm.get('issuerRegion')?.value;
    if (region) {
      this.tdrs.getIssuerStations(region).subscribe(stations => {
        this.issuerStations = stations;
        this.registrationForm.get('issuerStation')?.reset();
      });
    }
  }

  updateZones(): void {
    const region = this.registrationForm.get('region')?.value;
    if (region) {
      this.tdrs.getZones(region).subscribe(zones => {
        this.zones = zones;
        this.registrationForm.get('zone')?.reset();
        this.districts = [];
        this.kebeles = [];
      });
    }
  }

  updateDistricts(): void {
    const zone = this.registrationForm.get('zone')?.value;
    if (zone) {
      this.tdrs.getDistricts(zone).subscribe(districts => {
        this.districts = districts;
        this.registrationForm.get('district')?.reset();
        this.kebeles = [];
      });
    }
  }

  updateKebeles(): void {
    const district = this.registrationForm.get('district')?.value;
    if (district) {
      this.tdrs.getKebeles(district).subscribe(kebeles => {
        this.kebeles = kebeles;
        this.registrationForm.get('kebele')?.reset();
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file type and size
      if (!file.type.match('image/jpeg|image/png')) {
        this.registrationForm.get('photo')?.setErrors({ fileType: true });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB
        this.registrationForm.get('photo')?.setErrors({ fileSize: true });
        return;
      }
      
      // Update form control
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
    //console.log(this.registrationForm.value);
    if (this.registrationForm.valid) {
      const formValue: TemporaryDriverRegistration = {
        ...this.registrationForm.value,
        photo: this.selectedPhotoFile
      };

      this.tdrs.registerDriver(formValue).subscribe({
        next: () => alert('License registered successfully'),
        error: (err) => alert('Error: ' + err.message)
      });
    }
  }

  onReset(): void {
    this.registrationForm.reset();
    this.imagePreview = null;
  }

}
