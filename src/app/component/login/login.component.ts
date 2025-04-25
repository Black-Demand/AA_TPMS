import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router, RouterOutlet } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../header/header.component";

@Component({
  selector: 'app-login',
  imports: [
    RouterOutlet,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    HeaderComponent
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  private fb = inject(FormBuilder);
  private router = inject(Router);
  showPassword = false;

  
  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  passVis(): void{
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    let { username, password } = this.form.value; // Extract values from form controls
    
    if(username === 'Admin' && password === '123456') {
      this.router.navigate(['/nav-menu'])
    } else {
      alert('Incorrect username or password');
    }
  }
}

