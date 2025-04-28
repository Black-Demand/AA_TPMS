import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
import { dateCannotBeTheFuture } from '../../driver/age.validate';

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
    MatTabsModule
  ],
  templateUrl: './penalty-dif.component.html',
  styleUrl: './penalty-dif.component.css'
})
export class PenaltyDifComponent implements OnInit{

  penaltyForm!: FormGroup;
  penaltyTypes = ['Miscellaneous punishment', 'Pedestrian punishment'];
  codes = ['1','2','3'];

  constructor(
    private fb: FormBuilder,
  ) {
    this.penaltyForm = this.fb.group({
      fullName: ['', Validators.required],
      penaltyType: ['', Validators.required],
      yetCode: ['', Validators.required],
      payment: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      yetfesmbteKen: ['', [Validators.required, dateCannotBeTheFuture()]],
      yetkessbteKen: ['', [Validators.required, dateCannotBeTheFuture()]],
      yetketNumber: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      desc: ['']
    },
    { validators: this.dateRangeValidator }
  );
  }
  ngOnInit(): void {
  }

  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const yetKen = group.get('yetfesmbteKen')?.value;
    const yetsKen = group.get('yetkessbteKen')?.value;

    if(yetKen && yetsKen && yetKen > yetsKen){
        return { dateRangeInvalid: true };
    }
    return null;
}

  get minEndDate(): Date | null {
    return this.penaltyForm.get('yetfesmbteKen')?.value;
  }

  getErrorForYetfesmbetKen(): string {
    const field = this.penaltyForm.get('yetfesmbteKen');
  
    if (field?.hasError('required')) {
      return 'The Yetfesmbte Ken is required';
    }
  
    if (field?.hasError('dateCannotBeTheFuture')) {
      return field.getError('dateCannotBeTheFuture').message;
    }
  
    return '';
  }
  
  getErrorForYetkessbteKen(): string {
    const field = this.penaltyForm.get('yetkessbteKen');
  
    if (field?.hasError('required')) {
      return 'The Yetkessbte Ken is required';
    }
  
    if (field?.hasError('dateCannotBeTheFuture')) {
      return field.getError('dateCannotBeTheFuture').message;
    }
    if(this.penaltyForm.hasError('dateRangeInvalid')) {
      return 'Yetkessbte Ken must be greater than or equal to Yetfesmbte Ken';
    }
  
    return '';
  }
  getPaymentErrorMessage(): string{
    let field = this.penaltyForm.get('payment');
    if(field?.hasError('required')){
      return 'Payment is Required';
    }
    if(field?.hasError('pattern')){
      return 'Only Numbers are allowed';
    }
    return "";
  }
  getNumberErrorMessage(): string{
    let field = this.penaltyForm.get('yetketNumber');
    if(field?.hasError('required')){
      return 'Yetket Number is Required';
    }
    if(field?.hasError('pattern')){
      return 'Only Numbers are allowed';
    }
    return "";
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
 

  updateIssuerStations(): void {
 
  }

  updateZones(): void {
   
  }

  updateDistricts(): void {
   
  }

  updateKebeles(): void {
 
  }

  onSubmit(): void {
    console.log(this.penaltyForm.value);
  }

  onReset(): void {
    this.penaltyForm.reset();
  }

}

