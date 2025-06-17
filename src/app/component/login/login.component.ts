import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponent } from "../../header/header.component";
import { Router, RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    HeaderComponent,
    RouterOutlet,
    TranslateModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private translte = inject(TranslateService)
  
  showPassword = false;
  isLoading = false;
  
  form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async onLogin() {
    if (this.form.invalid) return;

    this.isLoading = true;
    const { username, password } = this.form.getRawValue();
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (username === 'Admin' && password === '123456') {
     this.toastr.success(this.translte.instant('TOASTER.SUCCESS.LOGIN'));
      this.router.navigate(['/nav-menu']);
    } else {
      this.toastr.error(this.translte.instant('TOASTER.ERROR.LOGIN'));
    }
    
    this.isLoading = false;
  }
}