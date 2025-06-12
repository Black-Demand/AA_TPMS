import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
// import { EthiopianDateAdapter } from '.Modules/ethiopian-date-adapter';
// import { ETHIOPIAN_DATE_FORMATS } from './ethiopian-date-formats';
import { EthiopianDateAdapter } from '../../Modules/ethiopian-date-adapter';
import { ETHIOPIAN_DATE_FORMATS } from '../../Modules/ethiopian-date-formats';
@Component({
  selector: 'app-ethiopian-datepicker',
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatNativeDateModule
  ],
  template: `
    <mat-form-field>
      <mat-label>Ethiopian Date</mat-label>
      <input matInput [matDatepicker]="picker" [(ngModel)]="selectedDate">
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>
    <p>Selected date: {{ selectedDate | date }}</p>
  `,
  providers: [
    { provide: DateAdapter, useClass: EthiopianDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: ETHIOPIAN_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' }
  ]
})
export class DatedemoComponent {
  selectedDate: Date = new Date();
  
  // Optional: Inject the adapter if you need to use it directly
  private dateAdapter = inject(DateAdapter);
}