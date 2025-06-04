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
    MatTimepickerModule
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


  
  violationgrades: Lookup.OffenceGradeDTO[] = [];
  violationtypes: Lookup.OffenceNewDTO[] = [];
  regions: Lookup.LicenceRegionDTO[] = [];
  majors: Lookup.Majors[] = [];

  

  constructor(
    private fb: FormBuilder,
    private tdrs: TempDriverService,
    private lookupservice: LookupService,
    private toastr: ToastrService,
    private router: Router
  ) {

  }

    ngOnInit(): void {
    this.loadRegions();
    this.loadMajors();
    this.loadViolationGrade();
    const data = this.tdrs.getDriverData();
    this.trafficForms();
    this.generateOrdderNumber();
   

    if(data){
      this.selectedDriver = data;
      this.trafficForm.patchValue({
        mainGuid: data.mainGuid,
        fullName: data.fullName,
        licenseNumber: data.licenseNumber
      })
    }
  }

  trafficForms(): void {
    
    this.trafficForm = this.fb.group({
      fullName: [{value: '', disabled: true}, Validators.required],
      licenseNumber: [{value: '', disabled: true}, Validators.required],
      violationGrade: ['', Validators.required],
      offenceId: [{ value: '', disabled: false }, Validators.required],
      violationDate: new FormControl<Date | null>(null, [Validators.required, dateNotTheFuture()]),
      tName: ['', Validators.required],
      action: ['', Validators.required],
      plateRegion: ['', Validators.required],
      NewPlateCode: ['', Validators.required],
      NewPlateNo: ['', Validators.required],
      placeAccused: ['', Validators.required],
      dateAccused: new FormControl<Date | null>(null, [Validators.required, dateNotTheFutures()]),
      payment: ['', Validators.required],
      ticket: ['', Validators.required],
      vehicleType: ['', Validators.required],
      timeAccused: ['', Validators.required],
      damageAssessment: this.fb.group({
        simpleBodyDamage: [false], heavyBodyDamage: [false], materialDamage: [false]
  })

    });
  }

    loadViolationGrade() {
    this.lookupservice.getAllOffences().subscribe(data => {
       this.violationgrades = data;
    });
  }

 loadViolationTypeByGrade(gradeCode: string) {
    const numericGradeCode = Number(gradeCode);
  
    if (numericGradeCode > 3) {
      this.violationTypeDisabled = true;
      this.trafficForm.get('violationType')?.reset();
      this.trafficForm.get('violationType')?.disable();
      this.violationtypes = [];
    } else {
      this.violationTypeDisabled = false;
      this.trafficForm.get('violationType')?.enable();
      this.lookupservice.getAllOffenceNew([gradeCode]).subscribe(data => {
        this.violationtypes = data;
      });
    }
  }

    dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const yetKen = group.get('violationDate')?.value;
    const yetsKen = group.get('dateAccused')?.value;

    if(yetKen && yetsKen && yetKen > yetsKen){
        return { dateRangeInvalid: true };
    }
    return null;
}

  get minEndDate(): Date | null {
    return this.trafficForm.get('violationDate')?.value;
  }
  getErrorMessageForYetfesmbetKen():string{
    let field = this.trafficForm.get('violationDate');
    
    if(field?.hasError('required')){
      return 'The field is Required';
    }
    if(field?.hasError('dateNotTheFuture')){
      return field.getError('dateNotTheFuture').message;
    }
    return "";
  }


   getErrorMessageForYetfessmbetKen():string{
    let field = this.trafficForm.get('dateAccused');
    
    if(field?.hasError('required')){
      return 'The field is Required';
    }
    if(field?.hasError('dateNotTheFuture')){
      return field.getError('dateNotTheFuture').message;
    }
    if(this.trafficForm.hasError('dateRangeInvalid')) {
      return 'Yetkessbte Ken must be greater than or equal to Yetfesmbte Ken';
    }
    return "";
  }

    generateOrdderNumber(){
    const ticketNum = Math.floor(100000 + Math.random() * 900000);
    const ticket = `${ticketNum}`;

    this.trafficForm?.get('ticket')?.setValue(ticket);
    this.trafficForm?.get('ticket')?.disable();
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
  
  onSubmit(): void {
  if (this.trafficForm.valid) {
    // Get all values including disabled fields
    const formValue = {
      ...this.trafficForm.getRawValue(), // This includes disabled fields
      fullName: this.selectedDriver.fullName,
      licenseNumber: this.selectedDriver.licenseNumber
    };

    // Add to violations array for the table
    this.violations.push(formValue);
    
    console.log('Violation submitted:', formValue);

    this.tdrs.createDriver(formValue).subscribe({
      next: (response) => {
        this.toastr.success("Driver created successfully");
      },
      error: (err) => {
        console.error('Error creating driver:', err);
        this.toastr.error("Error creating driver:", err);
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