import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
 
// Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker'
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from "@angular/material/radio";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import Lookup from '../../Models/lookup';
import { LookupService } from '../../services/lookup.service';
import { DriverDTO } from '../../Models/driver';
import { TempDriverService } from '../../services/temp-driver.service';
import { ToastrService } from 'ngx-toastr';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { dateNotTheFuture, dateNotTheFutures } from '../../service/date.validate';
import { ACTION_OPTIONS, ActionOption} from '../../Enums/actiontaken';
import { PenalityfortrafficService } from '../../services/penalityfortraffic.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-traffic',
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
    MatCheckboxModule,
    MatTimepickerModule,
    TranslateModule
  ],
  templateUrl: './traffic.component.html',
  styleUrl: './traffic.component.css'
})
export class TrafficComponent  implements OnInit {

  trafficForm!: FormGroup;
  violationTypeDisabled = false;
  violations: any[] = [];
  displayedColumns: string[] = ['fullName', 'licenseNumber', 'ticket', 'dateAccused'];

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
  selectedDriver!: DriverDTO;
  selectedAction = '';



  violationgrades: Lookup.OffenceGradeDTO[] = [];
  violationtypes: Lookup.OffenceNewDTO[] = [];
  regions: Lookup.LicenceRegionDTO[] = [];
  majors: Lookup.Majors[] = [];
  vhicleTypes: Lookup.VehicleBodyTypeDTO[] = [];
  actionOptions: ActionOption[] = ACTION_OPTIONS;


  constructor(
    private fb: FormBuilder,
    private tdrs: TempDriverService,
    private lookupservice: LookupService,
    private toastr: ToastrService,
    private router: Router,
    private penalityForTraffic: PenalityfortrafficService,
    private translate: TranslateService
  ) {

  }

  ngOnInit(): void {
  
  this.trafficForms();
  this.loadRegions();
  this.loadMajors();
  this.loadViolationGrade();
  this.loadVheicleBodyType();
  this.generateTicketNumber();

  this.trafficForm.get('offenceId')?.valueChanges.subscribe(offenceId => {
    const selectedOffence = this.violationtypes.find(o => o.offenceId === Number(offenceId));
    if (selectedOffence) {
      this.trafficForm.get('amount')?.setValue(selectedOffence.fineAmount);
    }
  });


  const data = this.tdrs.getDriverData();
  if (data) {
    this.selectedDriver = data;
    this.trafficForm.patchValue({
      mainGuid: data.mainGuid,
      fullName: data.fullName,
      licenseNumber: data.licenseNumber
    });
  }
}
 


  trafficForms(): void {
  this.trafficForm = this.fb.group({
      fullName: [{ value: '', disabled: true }, Validators.required],
      licenseNumber: [{ value: '', disabled: true }, Validators.required],
      violationGrade: ['', Validators.required],
      offenceId: [{ value: '', disabled: false }, Validators.required],
      violationDate: new FormControl<Date | null>(null, [Validators.required, dateNotTheFuture()]),
      actionTakenBy: ['', Validators.required],
      actionTaken: ['', Validators.required],
      plateRegion: ['', Validators.required],
      newPlateCode: ['', Validators.required],
      newPlateNo: ['', Validators.required],
      violationPlace: ['', Validators.required],
      dateAccused: new FormControl<Date | null>(null, [Validators.required, dateNotTheFutures()]),
      amount: [{ value: '', disabled: true }, Validators.required],
      ticketNo: [{ value: '', disabled: true }, Validators.required],
      vehicleType: ['', Validators.required],
      violationTime: ['', Validators.required],
      isLightInjury: [false],
      isSevereInjury: [false],
      isPropertyDamage: [false]
  });


}

  loadViolationGrade() {
    this.lookupservice.getAllOffences().subscribe(data => {
      this.violationgrades = data;

      this.trafficForm.get('violationGrade')?.valueChanges.subscribe(gradeCode => {
        const selectedGrade = this.violationgrades.find(g => g.code === gradeCode);
        console.log(selectedGrade);
        if (selectedGrade) {
         this.trafficForm.get('amount')?.setValue(String(selectedGrade.fineAmount));
        }

        this.loadViolationTypeByGrade(gradeCode);
      });
    });
  }





  loadViolationTypeByGrade(gradeCode: string) {
    const numericGradeCode = Number(gradeCode);

    if (numericGradeCode > 3) {
      this.violationTypeDisabled = true;
      this.trafficForm.get('offenceId')?.reset();
      this.trafficForm.get('offenceId')?.disable();
      this.violationtypes = [];
    } else {
      this.violationTypeDisabled = false;
      this.trafficForm.get('offenceId')?.enable();
      this.lookupservice.getAllOffenceNew([gradeCode]).subscribe(data => {
        this.violationtypes = data;
      });
    }
  }


  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const yetKen = group.get('violationDate')?.value;
    const yetsKen = group.get('dateAccused')?.value;

    if (yetKen && yetsKen && yetKen > yetsKen) {
      return { dateRangeInvalid: true };
    }
    return null;
  }

  get minEndDate(): Date | null {
    return this.trafficForm.get('violationDate')?.value;
  }
  getErrorMessageForYetfesmbetKen(): string {
    let field = this.trafficForm.get('violationDate');

    if (field?.hasError('required')) {
      return this.translate.instant('ERROR.REQUIRED');
    }
    if (field?.hasError('dateNotTheFuture')) {
      return this.translate.instant('ERROR.DATE_NOT_IN_FUTURE')
    }
    return "";
  }


  getErrorMessageForYetfessmbetKen(): string {
    let field = this.trafficForm.get('dateAccused');

    if (field?.hasError('required')) {
    return this.translate.instant('ERROR.REQUIRED');
    }
    if (field?.hasError('dateNotTheFuture')) {
      return this.translate.instant('ERROR.DATE_NOT_IN_FUTURE')
    }
    if (this.trafficForm.hasError('dateRangeInvalid')) {
      return this.translate.instant('ERROR.DATE_RANGE_INVALID')
    }
    return "";
  }

  generateTicketNumber() {
    const ticketNum = Math.floor(100000 + Math.random() * 900000);
    const ticketNo = `${ticketNum}`;

    this.trafficForm?.get('ticketNo')?.setValue(ticketNo);
    this.trafficForm?.get('ticketNo')?.disable();
  }


  loadRegions() {
    this.lookupservice.getAllRegions().subscribe(data => {
      this.regions = data;
    });
  }

  loadMajors() {
    this.lookupservice.getAllMajors().subscribe(data => {
      this.majors = data;
    });
  }

  loadVheicleBodyType() {
    this.lookupservice.getAllVehicles().subscribe(data => {
      this.vhicleTypes = data;
    })
  }





  onSubmit(): void {
    
  if (this.trafficForm.valid) {
    const formValue = {
      ...this.trafficForm.getRawValue(), 
      fullName: this.selectedDriver.fullName,
      licenseNumber: this.selectedDriver.licenseNumber,
      ticket: this.trafficForm.get('ticketNo')?.value,
    
    };

    console.log('🚀 Form Submitted:', formValue); 

    this.penalityForTraffic.createPenalityForTraffic(formValue, formValue.licenseNumber).subscribe({
      next: () => this.toastr.success("Penalty created successfully"),
      error: err => {
        console.error('❌ Backend error:', err);
        this.toastr.error("Error creating penalty");
      }
    });
  } else {
    this.trafficForm.markAllAsTouched();
  }
}


  onReset(): void {
    this.trafficForm.reset();
  }
}