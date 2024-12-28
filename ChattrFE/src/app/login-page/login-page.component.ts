import { Component } from '@angular/core';
import { AsyncPipe, NgStyle } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    NgStyle,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  loginInForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  emailIsInvalid$ = new BehaviorSubject<boolean>(false);
  passwordIsInvalid$ = new BehaviorSubject<boolean>(false);
  loginDenied$ = new BehaviorSubject<boolean>(false);
  hasClikedSubmit = false;
  opacity$ = new BehaviorSubject<number>(0);
  isLoading$ = new BehaviorSubject<boolean>(false);

  ngAfterViewInit() {
    setTimeout(() => {
      this.opacity$.next(1);
    }, 0);
  }

  ngOnDestroy() {
    this.emailIsInvalid$.unsubscribe();
    this.passwordIsInvalid$.unsubscribe();
    this.loginDenied$.unsubscribe();
    this.opacity$.unsubscribe();
    this.isLoading$.unsubscribe();
  }

  checkLoginFormValidity() {
    return this.loginInForm.valid;
  }


  onKeyUp(item: string) {
    if (!this.hasClikedSubmit) {
      return;
    }
    if (item === 'email') {
      if (this.loginInForm.controls.email.invalid) {
        this.emailIsInvalid$.next(true);
      }
      else {
        this.emailIsInvalid$.next(false);
      }
    }

    if (item === 'password') {
      if (this.loginInForm.controls.password.invalid) {
        this.passwordIsInvalid$.next(true);
      } else {
        this.passwordIsInvalid$.next(false);
      }
    }

  }

  submitForm() {
    this.hasClikedSubmit = true;
    this.formValidityCssControl();
    if (!this.checkLoginFormValidity()) {
      return;
    }
    this.isLoading$.next(true);

    setTimeout(() => { // Simulate a server request
      this.authService.loginWithCredentials$(
        this.loginInForm.value.email!,
        this.loginInForm.value.password!
      ).subscribe({
        next: (token) => {
          this.authService.isLoggedIn$.next(true);
          this.authService.putTokenInCookies(token);
          this.isLoading$.next(false);
          this.router.navigate(['/chat']);
        },
        error: (error) => {
          this.loginDenied$.next(true);
          this.isLoading$.next(false);
        }
      });
    }, 2000);
  }

  formValidityCssControl = () => {
    if (this.loginInForm.controls.email.invalid) {
      this.emailIsInvalid$.next(true);
    }
    if (this.loginInForm.controls.password.invalid) {
      this.passwordIsInvalid$.next(true);
    }
  };

  changeRoute() {
    this.changeOpacity();
    setTimeout(() => {
      this.router.navigate(['/register']);
    }, 500);
  }

  changeOpacity() {
    this.opacity$.next(0);
  }

}
