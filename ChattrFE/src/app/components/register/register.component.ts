import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe, NgStyle } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { AuthService } from '../../shared/auth/services/auth.service';
import { AddUser } from '../../shared/models/add-user.interface';

@Component({
  selector: 'app-register',
  imports: [
    NgStyle,
    RouterLink,
    AsyncPipe,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  firstNameIsInvalid$ = new BehaviorSubject<boolean>(false);
  lastNameIsInvalid$ = new BehaviorSubject<boolean>(false);
  emailIsInvalid$ = new BehaviorSubject<boolean>(false);
  passwordIsInvalid$ = new BehaviorSubject<boolean>(false);
  registerDenied$ = new BehaviorSubject<boolean>(false);
  hasClikedSubmit = false;
  isLoading$ = new BehaviorSubject<boolean>(false);

  opacity = 0;
  arrowTransform = false;

  ngAfterViewInit() {
    setTimeout(() => {
      this.opacity = 1;
    }, 0);
  }

  moveArrow(num: number) {
    if (num === 1) {
      this.arrowTransform = false;
    } else {
      this.arrowTransform = true;
    }
  }

  checkLoginFormValidity() {
    return this.registerForm.valid;
  }


  onKeyUp(item: string) {
    if (!this.hasClikedSubmit) {
      return;
    }
    if (item === 'email') {
      if (this.registerForm.controls.email.invalid) {
        this.emailIsInvalid$.next(true);
      }
      else {
        this.emailIsInvalid$.next(false);
      }
    }

    if (item === 'password') {
      if (this.registerForm.controls.password.invalid) {
        this.passwordIsInvalid$.next(true);
      } else {
        this.passwordIsInvalid$.next(false);
      }
    }

    if (item === 'firstName') {
      if (this.registerForm.controls.firstName.invalid) {
        this.firstNameIsInvalid$.next(true);
      } else {
        this.firstNameIsInvalid$.next(false);
      }
    }

    if (item === 'lastName') {
      if (this.registerForm.controls.lastName.invalid) {
        this.lastNameIsInvalid$.next(true);
      } else {
        this.lastNameIsInvalid$.next(false);
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

    const user: AddUser = {
      firstName: this.registerForm.value.firstName!,
      lastName: this.registerForm.value.lastName!,
      email: this.registerForm.value.email!,
      password: this.registerForm.value.password!
    };

    this.authService.register$(user)
      .pipe(
        tap((token) => {
          this.authService.isLoggedIn$.next(true);
          this.authService.putTokenInCookies(token);
          this.isLoading$.next(false);
        }),
        switchMap((token) => this.authService.saveUserInfos$(token.token))
      )
      .subscribe({
        next: (user) => {
          this.authService.user$.next(user);
          this.router.navigate(['/chat']);
        },
        error: (error) => {
          if (error.error.message === 'User already exists') {
            this.registerDenied$.next(true);
          }
          this.isLoading$.next(false);
        }
      });


  }

  formValidityCssControl = () => {
    if (this.registerForm.controls.firstName.invalid) {
      this.firstNameIsInvalid$.next(true);
    }
    if (this.registerForm.controls.lastName.invalid) {
      this.lastNameIsInvalid$.next(true);
    }

    if (this.registerForm.controls.email.invalid) {
      this.emailIsInvalid$.next(true);
    }
    if (this.registerForm.controls.password.invalid) {
      this.passwordIsInvalid$.next(true);
    }
  };

}
