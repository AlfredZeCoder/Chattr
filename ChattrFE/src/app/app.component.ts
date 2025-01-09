import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from './auth/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { switchMap, tap } from 'rxjs';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { iconSVG } from './utils/iconSVG';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatIconModule,
    AsyncPipe
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    private cookieService: CookieService,
    private router: Router
  ) {
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);

    iconRegistry.addSvgIconLiteral('mail', sanitizer.bypassSecurityTrustHtml(iconSVG.mail));
  }

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

  reload() {
    this.router.navigate(['/chat'])
      .then(() => {
        window.location.reload();
      });
  }

  logout() {
    this.cookieService.delete('access_token');
    this.reload();
  }
}
