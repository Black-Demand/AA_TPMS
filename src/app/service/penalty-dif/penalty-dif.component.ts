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
    private toastr: ToastrService
  ) {
    this.penaltyForm = this.fb.group(
      {
        fullName: ['', Validators.required],
        violationGrade: ['', Validators.required],
        violationType: ['', Validators.required],
        amount: [{ value: '', disabled: true }],
        violationDate: ['', [Validators.required, dateCannotBeTheFuture()]],
        dateAccused: ['', [Validators.required, dateCannotBeTheFuture()]],
        ticketNo: [''],
        desc: [''],
      },
      { validators: this.dateRangeValidator }
    );
  }
  ngOnInit(): void {
    this.loadCustomOffences();
    this.generateTicketNumber();
    
    // this.penaltyForm.patchValue({amount : response.amount})
  }

  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const yetKen = group.get('yetfesmbteKen')?.value;
    const yetsKen = group.get('yetkessbteKen')?.value;

    if (yetKen && yetsKen && yetKen > yetsKen) {
      return { dateRangeInvalid: true };
    }
    return null;
  }

  get minEndDate(): Date | null {
    return this.penaltyForm.get('yetfesmbteKen')?.value;
  }

  getErrorForViolationDate(): string {
    const field = this.penaltyForm.get('violationDate');

    if (field?.hasError('required')) {
      return 'The violationDate  is required';
    }

    if (field?.hasError('dateCannotBeTheFuture')) {
      return field.getError('dateCannotBeTheFuture').message;
    }

    return '';
  }

  getErrorForDateAccused(): string {
    const field = this.penaltyForm.get('dateAccused');

    if (field?.hasError('required')) {
      return 'The Yetkessbte Ken is required';
    }

    if (field?.hasError('dateCannotBeTheFuture')) {
      return field.getError('dateCannotBeTheFuture').message;
    }
    if (this.penaltyForm.hasError('dateRangeInvalid')) {
      return 'Date Accused  must be greater than or equal to Violation Date';
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

   generateTicketNumber(){
    const ticketNum = Math.floor(100000 + Math.random() * 900000);
    const ticketNo = `${ticketNum}`;

    this.penaltyForm?.get('ticketNo')?.setValue(ticketNo);
    this.penaltyForm?.get('ticketNo')?.disable();
  }

  loadCustomOffences() {
    this.lookupService.getCustomOffenceGrades().subscribe({
      next: (data) => {
        this.offences = data;
      },
      error: (err) => console.error('Failed to load offences', err),
    });
  }

  onPenaltyTypeChange(code: string) {
    this.loadViolationTypes(code);
    this.penaltyForm.get('yetCode')?.reset();
  }

  loadViolationTypes(code: string) {
    this.lookupService.getAllOffenceNew([code]).subscribe({
      next: (data) => {
        this.violationtypes = data;
      },
      error: (err) => console.error('Failed to load violation types', err),
    });
  }

  onSubmit(): void {
    if (this.penaltyForm.invalid) {
      this.penaltyForm.markAllAsTouched();
      return;
    }

    const formValue = this.penaltyForm.value;

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
        this.toastr.success("Miscellaneous penality Created successfully")
        console.log('Miscellaneous penality Created successfully:', response);
      },
      error: (error) => {
        this.toastr.error("Error occured while creating miscellaneous penality" , error)
        console.error('Creation failed:', error);
      },
    });
  }

  onReset(): void {
    this.penaltyForm.reset();
  }
}
