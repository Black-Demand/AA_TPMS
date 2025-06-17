import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDividerModule } from '@angular/material/divider';

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
    TranslateModule,
    MatDividerModule,
  ],
  templateUrl: './suspension.component.html',
  styleUrls: ['./suspension.component.css'],
})
export class SuspensionComponent implements OnInit {
  penaltyForm: FormGroup;
  showExpirationDate = false;
  totalCount = 0;
  pageSize = 10;
  pageIndex = 0;

  displayedColumns: string[] = [
    'injunctionBody',
    'injunctionDate',
    'injunctionLetterNo',
    // 'injunctionDate',
    'injunctionType',
    'status',
  ];
  dataSource: MatTableDataSource<InjunctionDTO>;
  suspensions: InjunctionDTO[] = [];
  injunctions: Lookup.InjunctionTypeDTO[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  selectedDriver!: DriverDTO;
  stepper: any;

  constructor(
    private fb: FormBuilder,
    private lookupService: LookupService,
    private injunctionService: InjunctionService,
    private driverService: TempDriverService,
    private toastr: ToastrService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.penaltyForm = this.fb.group({
      fullName: [{ value: '', disabled: true }, Validators.required],
      licenseNumber: [{ value: '', disabled: true }, Validators.required],
      injunctionBody: ['', Validators.required],
      injunctionDate: ['', [Validators.required, dateNotTheFutures()]],
      injunctionRegisteredDate: [
        '',
        [Validators.required, dateNotTheFutures()],
      ],
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
        queryParams: { redirectTo: 'suspension' },
      });
      return;
    }

    this.penaltyForm
      .get('injunctionDTO.parentGuid')
      ?.setValue(this.selectedDriver.mainGuid);

    this.loadInjunctionTypes();
    this.loadSuspensions();
    this.onSubmit();
    const data = this.driverService.getDriverData();

    if (data) {
      this.selectedDriver = data;

      this.penaltyForm.patchValue({
        mainGuid: data.mainGuid,
        fullName: data.fullName,
        licenseNumber: data.licenseNumber,
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
  this.injunctionService
    .getPagedInjunctions(this.pageIndex, this.pageSize, 'injunctionDate', 'DESC')
    .subscribe((result) => {
      this.dataSource.data = result.data;
      this.totalCount = result.totalCount; 
    });
}
onPageChange(event: PageEvent) {
  this.pageSize = event.pageSize;
  this.pageIndex = event.pageIndex;
  this.loadSuspensions();
}

 
  onSubmit(): void {
    console.log('Penalty form validity:', this.penaltyForm.valid);
    console.log('Selected driver:', this.selectedDriver);
    console.log('Full form value:', this.penaltyForm.value);

    if (this.penaltyForm.valid && this.selectedDriver?.mainGuid) {
      const injunctionDto: InjunctionDTO = {
        ...this.penaltyForm.value,
        parentGuid: this.selectedDriver.mainGuid,
      };

      const licenseNo = this.selectedDriver?.licenseNumber;

      console.log('Sending to penalty service:', injunctionDto);

      this.injunctionService.create(injunctionDto, licenseNo).subscribe({
        next: () => {
          this.toastr?.success(this.translate.instant('TOASTER.SUCCESS.INJ'));
          this.loadSuspensions();
        },
        error: (err) => {
          console.error('Error submitting suspension:', err);
          this.toastr?.error(this.translate.instant('TOASTER.ERROR.INJ'));
        },
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
    const selectedId = Number(this.penaltyForm.get('injunctionType')?.value);
    const selectedInjunction = this.injunctions.find(
      (i) => i.id === selectedId
    );

    const isTemporary = selectedInjunction?.id === 1;
    this.showExpirationDate = isTemporary;

    const expDateControl = this.penaltyForm.get('injunctionEndDate');

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
      return this.translate.instant('ERROR.REQUIRED');
    }
    if (field?.hasError('dateNotTheFuture')) {
      return this.translate.instant('ERROR.DATE_NOT_IN_FUTURE');
    }
    return '';
  }

  getErrorForSupDate(): string {
    const field = this.penaltyForm.get('injunctionRegisteredDate');
    if (field?.hasError('required')) {
      return this.translate.instant('ERROR.REQUIRED');
    }
    if (field?.hasError('dateNotTheFuture')) {
      return this.translate.instant('ERROR.DATE_NOT_IN_FUTURE');
    }
    return '';
  }
  getErrorForExpDate(): string {
    const field = this.penaltyForm.get('injunctionEndDate');
    if (field?.hasError('required')) {
      return this.translate.instant('ERROR.REQUIRED');
    }
    return '';
  }
formatDate(date: string | Date | null | undefined): string {
  if (!date) return '';
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return parsedDate.toLocaleDateString('en-GB'); 
}



getInjunctionDescription(id: number): string {
  const matched = this.injunctions.find(c => c.id === id);
  return matched ? matched.descriptionAmh : id.toString(); 
}

}
