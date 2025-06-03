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
  ],
  templateUrl: './driver-information.component.html',
  styleUrl: './driver-information.component.css'
})
export class DriverInformationComponent implements OnInit {
  
    form!: FormGroup;
    selectedDriver!: DriverDTO;
<<<<<<< HEAD
    nationalities: Lookup.LookupDTO[] = [];
=======
    nationalitys : Lookup.LookupDTO[] = [];
>>>>>>> f120db1f6b34f8d7dbb2e1d3aba9bbff0d71adfc


  constructor(
              private fb: FormBuilder,
              private driverService: TempDriverService,
              private dialog: MatDialog,
              private dialogRef: MatDialogRef<DriverInformationComponent>,
              private lookupService: LookupService,
  ) {
    this.form = this.fb.group({
        fullName: [{value: '', disabled: true}, Validators.required],
        nationality: [{value: '', disabled: true}, Validators.required],
        gender: [{value: '', disabled: true}, Validators.required],
        birthDate: [{value: '', disabled: true}, Validators.required],
        address: [{value: '', disabled: true}, Validators.required],
        town: [{value: '', disabled: true}, Validators.required],
    });
  }
  ngOnInit(): void {
       const data = this.driverService.getDriverData();
       

     if (data) {
        this.selectedDriver = data; 
<<<<<<< HEAD
        console.log(data);

      this.form.patchValue({
        fullName: data.fullName,
        nationality: this.getNatiolalityName(data.nationality),
        gender: data.gender,
        birthDate: data.birthDate,
        issuerRegion: data.address,
        licenceArea: data.town
=======
console.log(data);
      this.form.patchValue({
        fullName: data.fullName,
        nationality: data.nationality ?
        this.getNationality(data.nationality) : 'Unknown',
        gender: data.gender,
        birthDate: data.birthDate,
        address: data.address,
        town: data.town
>>>>>>> f120db1f6b34f8d7dbb2e1d3aba9bbff0d71adfc
      });
    }
  }

<<<<<<< HEAD
   private getNatiolalityName(code: string): string {
    return (
      this.nationalities.find((n) => n.code === code)?.amdescription || code
    );
  }


=======

    private getNationality(code: string): string {
    return (
      this.nationalitys.find((c) => c.code === code)?.amdescription || code
    );
  }

>>>>>>> f120db1f6b34f8d7dbb2e1d3aba9bbff0d71adfc
 

}
