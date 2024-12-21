import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private cookieService: CookieService
  ) { }

  ngOnInit() {
    const token = this.cookieService.get('access_token');
    if (token) {
      this.authService.loginWithToken$(token).subscribe({
        next: (token) => {
          this.authService.putTokenInCookies(token);
          this.authService.isLoggedIn$.next(true);
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }
}
