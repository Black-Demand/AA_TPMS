import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
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
import { CommonModule } from '@angular/common';
import { dateNotTheFutures } from '../date.validate';
import { InjunctionDTO } from '../../Models/Injunction';
import { InjunctionService } from '../../services/injunction.service';
import Lookup from '../../Models/lookup';
import { LookupService } from '../../services/lookup.service';
import { TempDriverService } from '../../services/temp-driver.service';
import { DriverDTO } from '../../Models/driver';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

interface SuspensionRecord {
  fullName: string;
  licenseNumber: string;
  blocked: string;
  regDate: Date;
  susDate: Date;
  susLevel: string;
  expDate: Date;
  letterNumber: string;
  reason: string;
}

@Component({
  selector: 'app-suspension',
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
  templateUrl: './suspension.component.html',
  styleUrls: ['./suspension.component.css'],
})
export class SuspensionComponent implements OnInit {
  penaltyForm: FormGroup;
  showExpirationDate = false;

  displayedColumns: string[] = [
    'injunctionBody',
    'regDate',
    'letterNumber',
    'susDate',
    'susLevel',
    'status',
  ];
  dataSource: MatTableDataSource<InjunctionDTO>;
  suspensions: InjunctionDTO[] = [];
  injunctions: Lookup.InjunctionTypeDTO[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  selectedDriver!: DriverDTO;
  stepper: any;

  constructor(private fb: FormBuilder,
     private lookupService: LookupService,
     private injunctionService: InjunctionService,
     private driverService: TempDriverService,
     private toastr : ToastrService,
     private router: Router) {


    this.penaltyForm = this.fb.group({
      fullName: [{ value: '', disabled: true }, Validators.required],
      licenseNumber: [{ value: '', disabled: true }, Validators.required],
      injunctionBody: ['', Validators.required],
      injunctionDate: ['', [Validators.required, dateNotTheFutures()]],
      injunctionRegisteredDate: ['', [Validators.required, dateNotTheFutures()]],
      injunctionType: ['', Validators.required],
      injunctionEndDate: [''], 
      injunctionLetterNo: ['', Validators.required],
      reason: ['', Validators.required],
    });

    this.dataSource = new MatTableDataSource(this.suspensions);
  }

  ngOnInit(): void {
    const driver = this.driverService.getDriverData(); // Add this method
     if (!this.driverService.driverData$) {
    this.router.navigate(['/penalty-driver'], {
      queryParams: { redirectTo: 'suspension' }
    });
    return;
  }

    this.penaltyForm.get('injunctionDTO.parentGuid')?.setValue(this.selectedDriver.mainGuid);

    this.loadInjunctionTypes();
    this.loadSuspensions();
    this.onSubmit();
        const data = this.driverService.getDriverData();

      if (data) {

        this.selectedDriver = data; 

      this.penaltyForm.patchValue({
        mainGuid: data.mainGuid,
        fullName: data.fullName,
        licenseNumber: data.licenseNumber
      });
    }
  }

  loadInjunctionTypes() {
    this.lookupService.getAllInjunctionTypes().subscribe({
      next: (data) => {
        this.injunctions = data;
      },
    });
  }

  loadSuspensions() {
  this.injunctionService.getAll().subscribe(suspensions => {
    this.dataSource.data = suspensions;
  });
}



  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

onSubmit(): void {
  console.log('Penalty form validity:', this.penaltyForm.valid);
  console.log('Selected driver:', this.selectedDriver);
  console.log('Full form value:', this.penaltyForm.value);

  if (this.penaltyForm.valid && this.selectedDriver?.mainGuid) {
    const injunctionDto: InjunctionDTO = {
      ...this.penaltyForm.value,    
      parentGuid: this.selectedDriver.mainGuid
    };

    const licenseNo = this.selectedDriver?.licenseNumber; 

    console.log('Sending to penalty service:', injunctionDto);

    this.injunctionService.create(injunctionDto, licenseNo)
      .subscribe({
        next: () => {
          this.toastr?.success("Suspension added successfully");
          this.loadSuspensions();
        },
        error: (err) => {
          console.error('Error submitting suspension:', err);
          this.toastr?.error('Failed to submit suspension.');
        }
      });
  } else {
    console.warn('Form invalid or driver not selected.');
  }
}





  onReset(): void {
    this.penaltyForm.reset();
  }

  isActive(suspension: SuspensionRecord): boolean {
    return new Date(suspension.expDate) > new Date();
  }
 onSuspensionLevelChange(): void {
  const selectedId = Number(this.penaltyForm.get('injunctionType')?.value); // convert to number
  const selectedInjunction = this.injunctions.find(i => i.id === selectedId);

  const isTemporary = selectedInjunction?.id === 1; // or use a flag if available
  this.showExpirationDate = isTemporary;

  const expDateControl = this.penaltyForm.get('injunctionEndDate'); // make sure this name matches your form

  if (isTemporary) {
    expDateControl?.setValidators(Validators.required);
  } else {
    expDateControl?.clearValidators();
    expDateControl?.reset();
  }

  expDateControl?.updateValueAndValidity();
}


  getErrorForRegDate(): string {
    const field = this.penaltyForm.get('injunctionDate');
    if (field?.hasError('required')) {
      return 'Registration Date is required';
    }
    if (field?.hasError('dateNotTheFuture')) {
      return field.getError('dateNotTheFuture').message;
    }
    return '';
  }

  getErrorForSupDate(): string {
    const field = this.penaltyForm.get('injunctionRegisteredDate');
    if (field?.hasError('required')) {
      return 'Suspension Date is required';
    }
    if (field?.hasError('dateNotTheFuture')) {
      return field.getError('dateNotTheFuture').message;
    }
    return '';
  }
  getErrorForExpDate(): string {
    const field = this.penaltyForm.get('injunctionEndDate');
    if (field?.hasError('required')) {
      return 'Expiration Date is required';
    }
    return '';
  }
}
