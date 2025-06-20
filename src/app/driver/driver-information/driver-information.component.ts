import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { LookupService } from '../../services/lookup.service';
import { TempDriverService } from '../../services/temp-driver.service';
import { DriverDTO } from '../../Models/driver';
import Lookup from '../../Models/lookup';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-driver-information',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    TranslateModule,
  ],
  templateUrl: './driver-information.component.html',
  styleUrl: './driver-information.component.css',
})
export class DriverInformationComponent implements OnInit {
  form!: FormGroup;
  selectedDriver!: DriverDTO;
  nationalitys: Lookup.LookupDTO[] = [];
  imageSrc: string | null = null;

  constructor(
    private fb: FormBuilder,
    private driverService: TempDriverService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<DriverInformationComponent>,
    private lookupService: LookupService
  ) {
    this.form = this.fb.group({
      fullName: [{ value: '', disabled: true }, Validators.required],
      nationality: [{ value: '', disabled: true }, Validators.required],
      gender: [{ value: '', disabled: true }, Validators.required],
      birthDate: [{ value: '', disabled: true }, Validators.required],
      address: [{ value: '', disabled: true }, Validators.required],
      town: [{ value: '', disabled: true }, Validators.required],
    });
  }
 ngOnInit(): void {
  this.lookupService.getAllNationality().subscribe((data) => {
    this.nationalitys = data;

    const driverData = this.driverService.getDriverData();
    if (driverData) {
      this.selectedDriver = driverData;

      this.form.patchValue({
        fullName: driverData.fullName,
        nationality: this.getNationality(driverData.nationality),
        gender: this.getGender(driverData.gender),
        birthDate: this.formatDate(driverData.birthDate),
        address: driverData.address,
        town: driverData.town
        
      });
    console.log('Photo:', driverData.photo);

      // ✅ Load base64 photo
      if (driverData.photo) {
        this.imageSrc = `data:image/jpeg;base64,${driverData.photo.trim()}`;
      }
    }
  });
}


  private formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  private getGender(code: number): string {
    switch (code) {
      case 0:
        return 'Male';
      case 1:
        return 'Female';
      default:
        return '';
    }
  }

  private getNationality(code: string | number): string {
    const matched = this.nationalitys.find(
      (c) => String(c.code) === String(code)
    );
    return matched ? matched.amdescription : String(code);
  }
}
