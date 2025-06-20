import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { MatRadioModule } from '@angular/material/radio';
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
import { ToastrService } from 'ngx-toastr';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { amharicOnlyValidator, englishOnlyValidator } from '../../service/amharicOnlyValidator';
import { dateNotTheFutures } from '../../service/date.validate';
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
    MatTabsModule,
    MatDividerModule,
    TranslateModule,
  ],
  templateUrl: './temporary-registraion.component.html',
  styleUrls: ['./temporary-registraion.component.css'],
})
export class TemporaryRegistraionComponent implements OnInit {
  registrationForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  selectedPhotoFile: File | null = null;

  genderEnum = Gender;
  genderOptions = [
    { value: Gender.Male, label: GenderDescriptions[Gender.Male] },
    { value: Gender.Female, label: GenderDescriptions[Gender.Female] },
  ];
  regions: Lookup.RegionDTO[] = [];
  zones: Lookup.ZoneDTO[] = [];
  woredas: Lookup.WoredaDTO[] = [];
  kebeles: Lookup.KebeleDTO[] = [];
  licenceRegions: Lookup.LicenceRegionDTO[] = [];
  licenceAreas: Lookup.LicenceAreaDTO[] = [];
  licenceCatagories: Lookup.LicenceCategoryDTO[] = [];
  nationalities: Lookup.LookupDTO[] = [];
  base64Photo: string | null = null;

  selectedRegionCode!: number;
  selectedZoneCode!: number;
  selectedWoredaCode!: number;
  selectedLicenceRegionCode: number = 0;

  constructor(
    private fb: FormBuilder,
    private tdrs: TempDriverService,
    private lookupservice: LookupService,
    private toastr: ToastrService,
    private router: Router,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {
    this.registrationForm = this.fb.group(
      {
        licenceRegion: ['', Validators.required],
        licenceArea: ['', Validators.required],
        licenceGrade: ['', Validators.required],
        licenceNo: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(6),
          ],
        ],
        issuanceDate: ['', [Validators.required, dateCannotBeTheFuture()]],
        firstNameAmh: ['', [Validators.required, amharicOnlyValidator()]],
        fatherNameAmh: ['', [Validators.required, amharicOnlyValidator()]],
        grandNameAmh: ['', [Validators.required, amharicOnlyValidator()]],
        firstName: ['', [Validators.required, englishOnlyValidator()]],
        fatherName: ['', [Validators.required, englishOnlyValidator()]],
        grandName: ['', [Validators.required, englishOnlyValidator()]],
        nationality: ['', Validators.required],
        sex: ['', Validators.required],
        birthDate: [
          '',
          [Validators.required, minAgeValidator(18), dateCannotBeTheFuture()],
        ],
        tel1: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
        region: ['', Validators.required],
        zone: ['', Validators.required],
        woreda: ['', Validators.required],
        kebele: ['', Validators.required],
        houseNo: [''],
        remark: [''],
        photo: ['', Validators.required],
      },
      {
        updateOn: 'change', 
      }
    );
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); 
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

  getErrorForPhonrNo(): string {
    const field = this.registrationForm.get('tel1');

    if (field?.hasError('required')) {
      return this.translate.instant('ERROR.REQUIRED');
    }

    if (field?.hasError('pattern')) {
      return this.translate.instant('ERROR.PHONE_PATTERN');
    }

    return '';
  }

  getErrorForLicenseNumber(): string {
    if (this.licenseNumberControl?.hasError('required')) {
      return "Driver's License Number is required";
    }
    if (
      this.licenseNumberControl?.hasError('minlength') ||
      this.licenseNumberControl?.hasError('maxlength')
    ) {
      return 'Must be exactly 6 characters';
    }
    return '';
  }

  getErrorForIssueDate(): string {
    const field = this.registrationForm.get('issuanceDate');

    if (field?.hasError('dateCannotBeTheFuture')) {
      return 'Issue date cannot be in the future';
    }

    return '';
  }

  getErrorForBirthDate(): string {
    const field = this.registrationForm.get('birthDate');

    if (field?.hasError('required')) {
      return this.translate.instant('ERROR.DOB_REQUIRED');
    }
    const minAgeError = field?.getError('minAge');
    if (minAgeError) {
      return this.translate.instant(minAgeError.messageKey, minAgeError.params);
    }

    const futureDateError = field?.getError('dateCannotBeTheFuture');
    if (futureDateError) {
      return this.translate.instant(futureDateError.messageKey);
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
    this.selectedRegionCode = regionCode;
    this.loadZones(regionCode);
  }

  onZoneChange(zoneCode: number) {
    console.log('Zone changed:', zoneCode);
    this.selectedZoneCode = zoneCode;
    this.loadWoredas(zoneCode);
  }

  onWoredaChange(woredaCode: number) {
    console.log('Woreda changed:', woredaCode);
    this.selectedWoredaCode = woredaCode;
    this.loadKebeles(woredaCode);
  }

  loadRegions() {
    this.lookupservice.getRegions().subscribe((data) => {
      this.regions = data;
      this.zones = [];
      this.woredas = [];
      this.kebeles = [];
    });
  }

  loadZones(regionCode: number) {
    this.lookupservice.getZonesByRegion(regionCode).subscribe((data) => {
      this.zones = data;
      this.woredas = [];
      this.kebeles = [];
    });
  }

  loadWoredas(zoneCode: number) {
    this.lookupservice.getWoredasByZone(zoneCode).subscribe((data) => {
      this.woredas = data;
      this.kebeles = [];
    });
  }

  loadKebeles(woredaCode: number) {
    this.lookupservice.getKebelesByWoreda(woredaCode).subscribe((data) => {
      this.kebeles = data;
    });
  }

  loadLicenceRegions(): void {
    this.lookupservice.getAllRegions().subscribe((data) => {
      console.log('Loaded Regions:', data);
      this.licenceRegions = data;
    });
  }
  onIssuerRegionChange(regionCode: number): void {
    console.log('Selected Region Code:', regionCode);
    if (regionCode != null) {
      this.selectedLicenceRegionCode = regionCode;
      this.loadAreasByLicenceRegion(regionCode);
    }
  }

  loadAreasByLicenceRegion(regionCode: number): void {
    this.lookupservice.getAllAreas(regionCode).subscribe((data) => {
      this.licenceAreas = data;
    });
  }

  loadCategories() {
    this.lookupservice.getAllCategories().subscribe((data) => {
      this.licenceCatagories = data;
    });
  }
  loadNationality() {
    this.lookupservice.getAllNationality().subscribe((data) => {
      this.nationalities = data;
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        this.registrationForm.get('photo')?.setErrors({ fileType: true });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.registrationForm.get('photo')?.setErrors({ fileSize: true });
        return;
      }

      this.selectedPhotoFile = file;
      this.registrationForm.patchValue({ photo: file });
      this.registrationForm.get('photo')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        this.base64Photo = base64;
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    console.log(this.registrationForm.value);

    if (this.registrationForm.valid) {
      const driver: DriverDTO = this.registrationForm.value;

      driver.photo = this.base64Photo;

      this.tdrs.createDriver(driver).subscribe({
        next: (response) => {
          this.toastr.success(this.translate.instant('TOASTER.SUCCESS.TEMP'));
          // this.router.navigate(['/penality']);
        },
        error: (err) => {
          console.error('Error creating driver:', err);
          alert(
            'Error: ' + (err.error?.message || err.message || 'Unknown error')
          );
          this.toastr.error(this.translate.instant('TOASTER.ERROR.TEMP'));
        },
      });
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }

  onReset(): void {
    this.registrationForm.reset();
    this.imagePreview = null;
    this.selectedPhotoFile = null;
  }
}
