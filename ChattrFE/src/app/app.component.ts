import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from './auth/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router
  ) { }

  ngOnInit() {
    const token = this.cookieService.get('access_token');
    if (!token) {
      this.authService.isLoggedIn$.next(false);
    }

    if (token) {
      this.authService.loginWithToken$(token)
        .pipe(
          tap((token) => {
            this.authService.putTokenInCookies(token);
            this.authService.isLoggedIn$.next(true);
          }),
          switchMap((token) => this.authService.saveUserInfos$(token.token))
        )
        .subscribe({
          next: (user) => {
            this.authService.user$.next(user);
          },
          error: () => {
            this.authService.isLoggedIn$.next(false);
            this.router.navigate(['/login']);
          }
        });
    }
  }
}
