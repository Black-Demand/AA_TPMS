import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { dateNotTheFuture, dateNotTheFutures } from '../date.validate';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
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
import Lookup from '../../Models/lookup';
import { LookupService } from '../../services/lookup.service';

interface DriverLicense {
  id: number;
  fullName: string;
  licenseId: string;
  yetketNumber: string;
  yetfesmbteKen: string;
  yetkessbtKen: string;
  yetefateLevel: string;
  yetefateCode: string;
  yeseladeRegion: string;
  yeseladeCode: string;
  yeseladeNumber: string;
  yeerkenPoint: number;
  yeerkenKefya: string;
  zegytoYemekefelPoint: number;
  zegytoYemekefelKefya: string;
  wozefPoint: number;
  totalPoint: number;
  yekefyaDay: Date;
  yedersgeNumber: string;
  yeckeNumber: string;
}
@Component({
  selector: 'app-penality',
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
    RouterLink
  ],
  templateUrl: './penality.component.html',
  styleUrl: './penality.component.css'
})
export class PenalityComponent implements OnInit {
  public get sharedData(): SharedServiceService {
    return this._sharedData;
  }
  public set sharedData(value: SharedServiceService) {
    this._sharedData = value;
  }


 private router = inject(Router);
  // Form steps
  isLinear = true;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  showResults = false;
  violationTypeDisabled = false;



  regions: Lookup.LicenceRegionDTO[] = [];
  majors: Lookup.Majors[] =[];
  violationgrades: Lookup.OffenceGradeDTO[] =[];
  violationtypes: Lookup.OffenceNewDTO[] =[];


  // Table data
  displayedColumns: string[] = [
    'number', 'yekefyaDay', 'yedersgeNumber', 'yeckeNumber', 
    'fullName', 'kefya', 'action'
  ];
  dataSource: any[] = [];  

  constructor(private fb: FormBuilder,
<<<<<<< HEAD
    private _sharedData: SharedServiceService
=======
              private sharedData: SharedServiceService,
              private lookupservice: LookupService
>>>>>>> 67920db1ffbf318a9e71a9cbd35f60c701c879f1
  ) {
    this.createForms();
  }
  ngOnInit() {
    this.loadRegions();
    this.loadMajors();
    this.loadViolationGrade();
    const data = this.sharedData.getDriverData();
    if (data) {
      this.firstFormGroup.patchValue({
        fullName: data.fullName,
        licenseId: data.licenseId
      });
    }
  }

  createForms(): void {
    // First form (basic information)
    this.firstFormGroup = this.fb.group({
      fullName: [{value: '', disabled: true}, Validators.required],
      licenseId: [{value: '', disabled: true}, Validators.required],
      yetketNumber: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      yetfesmbteKen: new FormControl<Date | null>(null, [Validators.required, dateNotTheFuture()]),
      yetkessbtKen: new FormControl<Date | null>(null, [Validators.required, dateNotTheFutures()]),
      violationGrade: ['', Validators.required],
      violationType: [{ value: '', disabled: false }, Validators.required],
      yeseladeRegion: ['', Validators.required],
      yeseladeCode: ['', Validators.required],
      yeseladeNumber: ['', Validators.required]
    },
   { validators: this.dateRangeValidator });

    // Second form (evaluation)
    this.secondFormGroup = this.fb.group({
      yeerkenPoint: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      yeerkenKefya: ['', Validators.required],
      zegytoYemekefelPoint: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      zegytoYemekefelKefya: ['', Validators.required],
      wozefPoint: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      totalPoint: [{value: 0, disabled: true}]
    });

    // Calculate total when points change
    this.secondFormGroup.valueChanges.subscribe(() => {
      this.calculateTotal();
    });
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

  loadViolationGrade() {
    this.lookupservice.getAllOffences().subscribe(data => {
       this.violationgrades = data;
    });
  }


  loadViolationTypeByGrade(gradeCode: string) {
    const numericGradeCode = Number(gradeCode);
  
    if (numericGradeCode > 3) {
      this.violationTypeDisabled = true;
      this.firstFormGroup.get('violationType')?.reset();
      this.firstFormGroup.get('violationType')?.disable();
      this.violationtypes = [];
    } else {
      this.violationTypeDisabled = false;
      this.firstFormGroup.get('violationType')?.enable();
      this.lookupservice.getAllOffenceNew([gradeCode]).subscribe(data => {
        this.violationtypes = data;
      });
    }
  }
  


  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const yetKen = group.get('yetfesmbteKen')?.value;
    const yetsKen = group.get('yetkessbtKen')?.value;

    if(yetKen && yetsKen && yetKen > yetsKen){
        return { dateRangeInvalid: true };
    }
    return null;
}

  get minEndDate(): Date | null {
    return this.firstFormGroup.get('yetfesmbteKen')?.value;
  }

  getErrorMessageForYetfesmbetKen():string{
    let field = this.firstFormGroup.get('yetfesmbteKen');
    
    if(field?.hasError('required')){
      return 'The field is Required';
    }
    if(field?.hasError('dateNotTheFuture')){
      return field.getError('dateNotTheFuture').message;
    }
    return "";
  }
  getErrorMessageForYetfessmbetKen():string{
    let field = this.firstFormGroup.get('yetkessbtKen');
    
    if(field?.hasError('required')){
      return 'The field is Required';
    }
    if(field?.hasError('dateNotTheFuture')){
      return field.getError('dateNotTheFuture').message;
    }
    if(this.firstFormGroup.hasError('dateRangeInvalid')) {
      return 'Yetkessbte Ken must be greater than or equal to Yetfesmbte Ken';
    }
    return "";
  }
  getNumberErrorMessage(): string{
    let field = this.firstFormGroup.get('yetketNumber');
    if(field?.hasError('required')){
      return 'Yetket Number is Required';
    }
    if(field?.hasError('pattern')){
      return 'Only Numbers are allowed';
    }
    return "";
  }

  calculateTotal(): void {
    const values = this.secondFormGroup.getRawValue();
    const total = values.yeerkenPoint + values.zegytoYemekefelPoint + values.wozefPoint;
    this.secondFormGroup.patchValue({ totalPoint: total });
  }

  saveFirstForm(): void {
    if (this.firstFormGroup.invalid) {
      return;
    }
    // Proceed to next form
  }

  onKeyDown(event: KeyboardEvent){
    const allowKey = ['Enter','Backspace', 'Escape', 'Delete','Tab','Dot'];
    if(allowKey.includes(event.key)){
      return;
    }
    
    if(event.ctrlKey && ['a','c','v','x'].includes(event.key.toLowerCase())){
      return;
    }

    if(isNaN(Number(event.key))){
      event.preventDefault();
    }
  }
 

  saveSecondForm() {
    if (this.secondFormGroup.valid) {
      // Calculate total points
      const totalPoints = 
        +this.secondFormGroup.value.yeerkenPoint +
        +this.secondFormGroup.value.zegytoYemekefelPoint +
        +this.secondFormGroup.value.wozefPoint;

      this.secondFormGroup.patchValue({ totalPoint: totalPoints });

      // Prepare data for the results table
      const resultData = {
        yekefyaDay: new Date(),  // Today's date
        yedersgeNumber: this.firstFormGroup.value.yetketNumber,
        yeckeNumber: this.firstFormGroup.value.yetefateCode,
        fullName: this.firstFormGroup.value.fullName,  // <-- FullName from first form
        kefya: this.secondFormGroup.value.yeerkenKefya
      };

      this.dataSource = [resultData];  // Assign to table data
      this.showResults = true;         // Show the results table
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString();
  }

  // Print a record (example function)
  printRecord(record: any) {
    console.log('Printing:', record);
    // Implement actual printing logic here
  }

}