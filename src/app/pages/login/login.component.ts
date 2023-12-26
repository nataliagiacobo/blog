import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IUser } from '../../interfaces/IUser';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, HttpClientModule, CommonModule],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  public user: IUser = {};
  public loginForm!: FormGroup;
  public error?: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid)
      return;

    this.user.username = this.loginForm.controls['username'].value;
    this.user.password = this.loginForm.controls['password'].value;

    this.authService.login(this.user).subscribe((response) => {
      this.error = response.message;
    });
  }

  onRegister() {
    this.router.navigate(['/register']);
  }

}

