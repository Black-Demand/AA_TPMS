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
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { id } from '@swimlane/ngx-charts';



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
    TranslateModule
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
  majors: Lookup.Majors[] = [];
  violationgrades: Lookup.OffenceGradeDTO[] = [];
  violationtypes: Lookup.OffenceNewDTO[] = [];


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
    private dialog: MatDialog,
    private translate: TranslateService
  ) {


  }
  ngOnInit() {
    this.loadRegions();
    this.loadMajors();
    this.loadViolationGrade();
    const data = this.driverService.getDriverData();
    this.createForms();
    this.generateOrderNumber();
    this.generateTicketNumber();

    if (data) {
      console.log(data);
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
    if (data) try {
      console.log('resulting driver data', data);
      this.secondFormGroup.patchValue({
        penalityPoints: data.NewPlateNo,
        amount: data.amount,
        delayPoints: data.delayPoints,
        DelayAmount: data.delayAmount,
        storedPoint: data.storedPointPoint ?? 0,
        totalAmount: data.totalAmount,
      });

      console.log(this.secondFormGroup.controls);
    }
      catch (e) {
        console.error('Patch error:', e);
      }
    if (data) {
      this.thirdFormGroup.patchValue({
        payment: data.amount
      })
    }
  }

  createForms(): void {
    this.firstFormGroup = this.fb.group({
      fullName: [{ value: '', disabled: true }, Validators.required],
      licenseNumber: [{ value: '', disabled: true }, Validators.required],
      ticketNo: [''],
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
      storedPoint: [{value: '' , disabled: true}, [Validators.required, Validators.min(0), Validators.max(100)]],
      totalAmount: [{value: 0, disabled: true}]
    });

    this.thirdFormGroup = this.fb.group({
      orderNumber: [''], // no validators
      payDay: new FormControl<Date | null>(null, [Validators.required, dateNotTheFutures()]),
      receiptNumber: ['', Validators.required],
      checkNumber: [''], // removed Validators.required
      fullName: [{ value: '', disabled: true }, Validators.required],
      payment: [{ value: '', disabled: true }, [Validators.required]]
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

  // const selectedGrade = this.violationgrades.find((v) => v.id === numericGradeCode);
  // if (selectedGrade && selectedGrade.fineAmount != null) {  
  //   console.log('Selected grade:', selectedGrade);

  //   this.secondFormGroup.get('amount')?.enable();
  //   this.secondFormGroup.get('amount')?.patchValue(String(selectedGrade.fineAmount));
  //   console.log('Patched fine amount:', selectedGrade.fineAmount);
  // } else {
  //   this.secondFormGroup.get('amount')?.reset();
  // }
  }



  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const vioDate = group.get('violationDate')?.value;
    const accuDate = group.get('dateAccused')?.value;

    if(vioDate && accuDate && vioDate > accuDate){
        return { dateRangeInvalid: true };
    }
    return null;
  }

  get minEndDate(): Date | null {
    return this.firstFormGroup.get('violationDate')?.value;
  }

  getErrorForPayDay(): string {
    const field = this.thirdFormGroup.get('payDay');

    if (field?.hasError('required')) {
      return this.translate.instant('ERROR.PAY_DAY_REQUIRED');
    }

    if (field?.hasError('dateNotTheFuture')) {
      return field.getError('dateNotTheFuture').message || this.translate.instant('ERROR.DATE_NOT_IN_FUTURE');
    }

    return '';
  }

  generateOrderNumber() {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `${randomNum}`;

    this.thirdFormGroup?.get('orderNumber')?.setValue(orderNumber);
    this.thirdFormGroup?.get('orderNumber')?.disable();
  }

  generateTicketNumber() {
    const ticketNum = Math.floor(100000 + Math.random() * 900000);
    const ticketNo = `${ticketNum}`;

    this.firstFormGroup?.get('ticketNo')?.setValue(ticketNo);
    this.firstFormGroup?.get('ticketNo')?.disable();
  }


  getErrorMessageForYetfesmbetKen(): string {
    const field = this.firstFormGroup.get('violationDate');

    if (field?.hasError('required')) {
      return this.translate.instant('ERROR.VIOLATION_DATE_REQUIRED');
    }

    if (field?.hasError('dateNotTheFuture')) {
      return field.getError('dateNotTheFuture').message || this.translate.instant('ERROR.DATE_NOT_IN_FUTURE');
    }

    return '';
  }


  getErrorMessageForYetfessmbetKen(): string {
    const field = this.firstFormGroup.get('dateAccused');

    if (field?.hasError('required')) {
      return this.translate.instant('ERROR.REQUIRED');
    }

    if (field?.hasError('dateNotTheFuture')) {
      return field.getError('dateNotTheFuture').message || this.translate.instant('ERROR.DATE_NOT_IN_FUTURE');
    }

    if (this.firstFormGroup.hasError('dateRangeInvalid')) {
      return this.translate.instant('ERROR.DATE_RANGE_INVALID');
    }

    return '';
  }


  getNumberErrorMessage(): string {
    const field = this.firstFormGroup.get('ticketNo');

    if (field?.hasError('required')) {
      return this.translate.instant('ERROR.TICKET_REQUIRED');
    }

    if (field?.hasError('pattern')) {
      return this.translate.instant('ERROR.TICKET_PATTERN');
    }

    return '';
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

      console.log('Sending to penalty service:', { region, licenseCategory, licenseNumber });

      this.penalityService.createPenality(dto, licenseNumber)
        .subscribe({
          next: (response) => {
            this.toastr.success(this.translate.instant('TOASTER.SUCCESS.PENAL'));

            console.log("Response from backend:", response);

            const {
              amount,
              penalityPoints,
              delayPoints,
              delayAmount,
              wozefPoint,
              totalAmount
            } = response;

            this.secondFormGroup.patchValue({
              penalityPoints: penalityPoints,
              amount: amount,
              delayPoints: delayPoints,
              delayAmount: delayAmount,
              wozefPoint: wozefPoint ?? 0,
              totalAmount: totalAmount
            });

            console.log('Second form group after patching:', this.secondFormGroup.value);
          },
          error: (err) => {
            console.error('Error submitting form:', err);
            this.toastr.error(this.translate.instant('TOASTER.ERROR.PENAL'));

          }
        });
    } else {
      // console.error('Form invalid or driver not selected');
    }
  }








  onKeyDown(event: KeyboardEvent) {
    const allowKey = ['Enter', 'Backspace', 'Escape', 'Delete', 'Tab', 'Dot'];
    if (allowKey.includes(event.key)) {
      return;
    }

    if (event.ctrlKey && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())) {
      return;
    }

    if (isNaN(Number(event.key))) {
      event.preventDefault();
    }
  }

  onStepChange(event: StepperSelectionEvent): void {
    if (event.selectedIndex === 2) {
      const paymentAmount = this.secondFormGroup.get('amount')?.value;
      this.thirdFormGroup.patchValue({ payment: paymentAmount });
      console.log('Patched payment to third form:', paymentAmount);
    }
  }

  savethirdForm(): void {

    const paymentAmount = this.secondFormGroup.get('amount')?.value;
    this.thirdFormGroup.patchValue({ payment: paymentAmount });

    this.thirdFormGroup.markAllAsTouched();

    console.log('Third form validity:', this.thirdFormGroup.valid);

    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.thirdFormGroup.markAllAsTouched();

        if (this.thirdFormGroup.valid) {
          const orderDto = this.thirdFormGroup.value;
          const licenseNumber = this.selectedDriver?.licenseNumber;

          if (!licenseNumber) {
            this.toastr.error('License number is missing. Cannot submit order.');
            return;
          }

          console.log('Submitting order with licenseNumber:', licenseNumber);
          console.log('Order DTO:', orderDto);

          this.ordersService.create(orderDto, licenseNumber).subscribe({
            next: (response) => {
              this.toastr.success(this.translate.instant('TOASTER.SUCCESS.ORDER'));
              console.log('Order response:', response);

              this.thirdFormGroup.get('payment')?.disable();
              this.thirdFormGroup.get('fullName')?.disable();
            },
            error: (err) => {
              this.toastr.error(this.translate.instant('TOASTER.ERROR.ORDER'));
              console.error('Order submission error:', err);
            }
          });
        } else {
          console.warn('Third form invalid, cannot submit');
        }
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