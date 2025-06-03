import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { dateNotTheFuture, dateNotTheFutures } from '../date.validate';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
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
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import Lookup from '../../Models/lookup';
import { LookupService } from '../../services/lookup.service';
import { TempDriverService } from '../../services/temp-driver.service';
import { PenalityService } from '../../services/penality.service';
import { Penality } from '../../Models/penality';
import { DriverDTO } from '../../Models/driver';
import { ToastrService } from 'ngx-toastr';
import { OrdersDTO } from '../../Models/order';
import { OrdersService } from '../../services/orders.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../../dialog/confirmation/confirmation/confirmation.component';



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
  
  ],
  standalone: true,
  templateUrl: './penality.component.html',
  styleUrl: './penality.component.css'
})
export class PenalityComponent implements OnInit {

  @ViewChild('stepper') stepper!: MatStepper;

 private router = inject(Router);
  isLinear = true;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;
  showResults = false;
  violationTypeDisabled = false;
  selectedDriver!: DriverDTO;



  regions: Lookup.LicenceRegionDTO[] = [];
  majors: Lookup.Majors[] =[];
  violationgrades: Lookup.OffenceGradeDTO[] =[];
  violationtypes: Lookup.OffenceNewDTO[] =[];


  displayedColumns: string[] = [
    'number', 'yekefyaDay', 'yedersgeNumber', 'yeckeNumber', 
    'fullName', 'kefya', 'action'
  ];
  dataSource: any[] = [];  
  licenseNo: any;

  constructor(private fb: FormBuilder,

              private lookupservice: LookupService,
              private penalityService: PenalityService,
              private driverService: TempDriverService,
              private toastr: ToastrService,
              private ordersService: OrdersService,
              private dialog: MatDialog
  ) {

  }
  ngOnInit() {
    this.loadRegions();
    this.loadMajors();
    this.loadViolationGrade();
    const data = this.driverService.getDriverData();
    this.createForms();
    this.generateOrdderNumber();

    if (data) {

        this.selectedDriver = data; 

      this.firstFormGroup.patchValue({
        mainGuid: data.mainGuid,
        fullName: data.fullName,
        licenseNumber: data.licenseNumber
      });
       this.thirdFormGroup.patchValue({
        fullName: data.fullName,
      });
    }
    if (data) try{
      console.log(data);
      this.secondFormGroup.patchValue({
        penalityPoints: data.penalityPoints,
        amount: data.amount,
        delayPoints: data.delayPoints,
        DelayAmount: data.delayAmount,
        wozefPoint: data.wozefPoint ?? 0,
        totalAmount: data.totalAmount,
      });

      console.log(this.secondFormGroup.controls);
    }
     catch (e) {
  console.error('Patch error:', e);
  }
  }

  createForms(): void {
    this.firstFormGroup = this.fb.group({
      fullName: [{value: '', disabled: true}, Validators.required],
      licenseNumber: [{value: '', disabled: true}, Validators.required],
      ticketNo: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      violationDate: new FormControl<Date | null>(null, [Validators.required, dateNotTheFuture()]),
      dateAccused: new FormControl<Date | null>(null, [Validators.required, dateNotTheFutures()]),
      violationGrade: ['', Validators.required],
      offenceId: [{ value: '', disabled: false }, Validators.required],
      plateRegion: ['', Validators.required],
      NewPlateCode: ['', Validators.required],
      NewPlateNo: ['', Validators.required],
      
    },
   { validators: this.dateRangeValidator });

    this.secondFormGroup = this.fb.group({
      penalityPoints: [{value: '' , disabled: true}, [Validators.required, Validators.min(0), Validators.max(100)]],
      amount: [{value: '' , disabled: true}, Validators.required],
      delayPoints: [{value: '' , disabled: true}, [Validators.required, Validators.min(0), Validators.max(100)]],
      delayAmount: [{value: '' , disabled: true}, Validators.required],
      wozefPoint: [{value: '' , disabled: true}, [Validators.required, Validators.min(0), Validators.max(100)]],
      totalAmount: [{value: 0, disabled: true}]
    });

    this.thirdFormGroup = this.fb.group({
      orderNumber: [''],
      payDay: new FormControl<Date | null>(null, [Validators.required, dateNotTheFutures()]),
      receiptNumber: ['', Validators.required],
      checkNumber: ['', Validators.required],
      fullName: [{value: '', disabled: true}, Validators.required],
      payment: ['',Validators.required]

    });

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
    const yetKen = group.get('violationDate')?.value;
    const yetsKen = group.get('dateAccused')?.value;

    if(yetKen && yetsKen && yetKen > yetsKen){
        return { dateRangeInvalid: true };
    }
    return null;
}

  get minEndDate(): Date | null {
    return this.firstFormGroup.get('violationDate')?.value;
  }


  getErrorForPayDay():string{
    let field = this.thirdFormGroup.get('payDay');

      if(field?.hasError('required')){
        return "The Pay Day is Required";
      }

       if(field?.hasError('dateNotTheFuture')){
      return field.getError('dateNotTheFuture').message;
    }
    return "";
  }

  generateOrdderNumber(){
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `${randomNum}`;

    this.thirdFormGroup?.get('orderNumber')?.setValue(orderNumber);
    this.thirdFormGroup?.get('orderNumber')?.disable();
  }
  

  getErrorMessageForYetfesmbetKen():string{
    let field = this.firstFormGroup.get('violationDate');
    
    if(field?.hasError('required')){
      return 'The field is Required';
    }
    if(field?.hasError('dateNotTheFuture')){
      return field.getError('dateNotTheFuture').message;
    }
    return "";
  }
  getErrorMessageForYetfessmbetKen():string{
    let field = this.firstFormGroup.get('dateAccused');
    
    if(field?.hasError('required')){
      return 'The field is Required';
    }
    if(field?.hasError('dateNotTheFuture')){
      return field.getError('dateNotTheFuture').message;
    }
    if(this.firstFormGroup.hasError('dateRangeInvalid')) {
      return 'dateAccused  must be greater than or equal to violation date';
    }
    return "";
  }
  getNumberErrorMessage(): string{
    let field = this.firstFormGroup.get('ticketNo');
    if(field?.hasError('required')){
      return 'Ticket Number is Required';
    }
    if(field?.hasError('pattern')){
      return 'Only Numbers are allowed';
    }
    return "";
  }
calculateTotal(): void {
  const values = this.secondFormGroup.getRawValue();
  const total = (values.penalityPoints || 0) + (values.delayAmount || 0) + (values.wozefPoint || 0);
  this.secondFormGroup.patchValue({ totalAmount: total });
}

submitFirstForm(): void {
  console.log('Form validity:', this.firstFormGroup.valid);
  console.log('Selected driver:', this.selectedDriver);

  if (this.firstFormGroup.valid && this.selectedDriver?.mainGuid) {
    const dto: Penality = {
      ...this.firstFormGroup.value,
      parentGuid: this.selectedDriver.mainGuid
    };
    
    const region = this.selectedDriver?.issuerRegion;
    const licenseCategory = this.selectedDriver?.licenseCategory;
    const licenseNumber = this.selectedDriver?.licenseNumber;
    // const mainGuid = this.selectedDriver?.mainGuid;
    console.log('Sending to penalty service:', { region, licenseCategory, licenseNumber });

    this.penalityService.createPenality(dto ,licenseNumber)
      .subscribe({
        next: () => { this.toastr.success("Penality added successfully")},
        error: (err) => {
          console.error('Error submitting form:', err);
          this.toastr.error('Failed to submit penalty.');
          console.log( "resuting dto",dto);
        }
      });
  } else {
    // console.error('Form invalid or driver not selected');
  }
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
 

//   saveSecondForm() {
//   if (this.secondFormGroup.valid) {
//     const rawValues = this.secondFormGroup.getRawValue(); 

//     const totalPoints =
//       +rawValues.PenalityPoints +
//       +rawValues.DelayPoints +
//       +rawValues.wozefPoint;

//     this.secondFormGroup.patchValue({ TotalAmount: totalPoints });

//     const resultData = {
//       yekefyaDay: new Date(),  // Today's date
//       yedersgeNumber: this.firstFormGroup.value.yetketNumber,
//       penalitypoints: this.firstFormGroup.value.penalitypoints,
//       fullName: this.firstFormGroup.value.fullName,
//       amount: rawValues.amount  // ⚠️ make sure this field exists

//     };

//     this.dataSource = [resultData];
//     this.showResults = true;
//   }
// }

savethirdForm() {
  const dialogRef = this.dialog.open(ConfirmationComponent, {
    width: '450px'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      // Only proceed if user confirmed
      if (this.thirdFormGroup.valid) {
        const orderDto: OrdersDTO = this.thirdFormGroup.value; 
        const licenseNo = this.licenseNo; 

        this.ordersService.create(orderDto, licenseNo).subscribe({
          next: (response) => {
            this.toastr.success("Order submitted successfully");
            console.log('Order submitted successfully:', response);
          },
          error: (err) => {
            this.toastr.error("Error submitting order");
            console.error('Error submitting order:', err);
          },
          complete: () => {
            console.log('Order submission completed.');
          }
        });
      } else {
        console.warn('Form is invalid');
        this.thirdFormGroup.markAllAsTouched(); 
      }
    } else {
      console.log('User cancelled the operation');
    }
  });
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