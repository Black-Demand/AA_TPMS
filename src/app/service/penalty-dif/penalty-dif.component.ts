import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
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
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { dateCannotBeTheFuture } from '../../driver/age.validate';
import { lookup } from 'node:dns';
import Lookup from '../../Models/lookup';
import { LookupService } from '../../services/lookup.service';
import { OrderdetailService } from '../../services/orderdetail.service';
import { OrderWithPenalityRequest } from '../../Models/OrderDetail';
import { ToastrService } from 'ngx-toastr';
import { response } from 'express';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { amharicOnlyValidator } from '../amharicOnlyValidator';

@Component({
  selector: 'app-penalty-dif',
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
  ],
  templateUrl: './penalty-dif.component.html',
  styleUrl: './penalty-dif.component.css',
})
export class PenaltyDifComponent implements OnInit {
  penaltyForm!: FormGroup;
  offences: Lookup.OffenceGradeDTO[] = [];
  violationtypes: Lookup.OffenceNewDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private lookupService: LookupService,
    private orderDetailService: OrderdetailService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadCustomOffences();
    this.penaltyForms();
    this.generateTicketNumber();
  }

  penaltyForms(): void {
    this.penaltyForm = this.fb.group(
      {
        fullName: ['', [Validators.required, amharicOnlyValidator()]],
        violationGrade: ['', Validators.required],
        violationType: ['', Validators.required],
        amount: [{ value: '', disabled: true }, Validators.required],
        violationDate: ['', [Validators.required, dateCannotBeTheFuture()]],
        dateAccused: ['', [Validators.required, dateCannotBeTheFuture()]],
        ticketNo: [''],
        desc: [''],
      },
      { validators: this.dateRangeValidator }
    );

    this.penaltyForm
      .get('violationGrade')
      ?.valueChanges.subscribe((gradeCode) => {
        this.onPenaltyTypeChange(gradeCode);
      });
  }

  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const violationDate = group.get('violationDate')?.value;
    const dateAccused = group.get('dateAccused')?.value;

    if (
      violationDate &&
      dateAccused &&
      new Date(violationDate) > new Date(dateAccused)
    ) {
      return { dateRangeInvalid: true };
    }
    return null;
  }

  get minEndDate(): Date | null {
    return this.penaltyForm.get('violationDate')?.value;
  }

  getErrorForViolationDate(): string {
    const field = this.penaltyForm.get('violationDate');

     if (field?.hasError('required')) {
      return this.translate.instant('ERROR.REQUIRED');
    }

    if (field?.hasError('dateCannotBeTheFuture')) {
      return this.translate.instant('ERROR.DATE_NOT_IN_FUTURE');
    }

    return '';
  }

  getErrorForDateAccused(): string {
    const field = this.penaltyForm.get('dateAccused');

    if (field?.hasError('required')) {
      return this.translate.instant('ERROR.REQUIRED');
    }

    if (field?.hasError('dateCannotBeTheFuture')) {
      return this.translate.instant('ERROR.DATE_NOT_IN_FUTURE');
    }

    if (this.penaltyForm.hasError('dateRangeInvalid')) {
      return this.translate.instant('ERROR.DATE_RANGE_INVALID');
    }
    return '';
  }

  getPaymentErrorMessage(): string {
    let field = this.penaltyForm.get('amount');
    if (field?.hasError('required')) {
      return 'Payment is Required';
    }
    if (field?.hasError('pattern')) {
      return 'Only Numbers are allowed';
    }
    return '';
  }

  generateTicketNumber() {
    const ticketNum = Math.floor(100000 + Math.random() * 900000);
    const ticketNo = `${ticketNum}`;
    this.penaltyForm?.get('ticketNo')?.setValue(ticketNo);
    this.penaltyForm?.get('ticketNo')?.disable();
  }

  loadCustomOffences() {
    this.lookupService.getCustomOffenceGrades().subscribe((data) => {
      this.offences = data;
    });
  }

  loadViolationTypes(code: string) {
    if (!code) {
      this.violationtypes = [];
      this.penaltyForm.get('violationType')?.reset();
      this.penaltyForm.get('amount')?.reset();
      return;
    }

    this.lookupService.getAllOffenceNew([code]).subscribe((data) => {
      this.violationtypes = data;
      this.penaltyForm.get('violationType')?.reset();
      this.penaltyForm.get('amount')?.reset();

      this.penaltyForm
        .get('violationType')
        ?.valueChanges.subscribe((offenceId) => {
          const selectedViolation = this.violationtypes.find(
            (v) => v.code === offenceId
          );
          if (selectedViolation) {
            console.log(selectedViolation);
            this.penaltyForm
              .get('amount')
              ?.setValue(selectedViolation.fineAmount.toString());
          } else {
            this.penaltyForm.get('amount')?.reset();
          }
        });
    });
  }

  onPenaltyTypeChange(code: string) {
    this.loadViolationTypes(code);
  }

  onSubmit(): void {
    if (this.penaltyForm.invalid) {
      this.penaltyForm.markAllAsTouched();
      return;
    }

    const formValue = this.penaltyForm.getRawValue();

    const request: OrderWithPenalityRequest = {
      orderDetailDTO: {
        id: formValue.id,
        ticketNo: formValue.ticketNo,
        amount: formValue.amount,
        description: formValue.desc,
      },
      penalityDTO: {
        penalityId: formValue.penalityId,
        ticketNo: formValue.ticketNo,
        violationDate: formValue.violationDate,
        dateAccused: formValue.dateAccused,
        violationGrade: formValue.violationGrade,
        offenceId: formValue.violationType,
      },
    };

    this.orderDetailService.create(request).subscribe({
      next: (response) => {
        this.toastr.success(this.translate.instant('TOASTER.SUCCESS.MISL'));
        console.log('Miscellaneous penality Created successfully:', response);
        // this.onReset();
      },
      error: (error) => {
        this.toastr.error(this.translate.instant('TOASTER.ERROR.MISL'));
        console.error('Creation failed:', error);
      },
    });
  }

  onReset(): void {
    this.penaltyForm.reset();
    this.generateTicketNumber();
    this.violationtypes = [];
  }
}