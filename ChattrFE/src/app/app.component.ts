import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './shared/auth/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { switchMap, tap } from 'rxjs';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { iconSVG } from './shared/utils/iconSVG';
import { AsyncPipe } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { PendingRequestComponent } from './components/pending-request/pending-request.component';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { WebsocketService } from './shared/services/websocket.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatIconModule,
    AsyncPipe,
    MatBadgeModule,
    MatMenuModule,
    PendingRequestComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
    private webSocketService: WebsocketService
  ) {
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);

    iconRegistry.addSvgIconLiteral('mail', sanitizer.bypassSecurityTrustHtml(iconSVG.mail));
    iconRegistry.addSvgIconLiteral('openedMail', sanitizer.bypassSecurityTrustHtml(iconSVG.openedMail));
  }

  @ViewChild(MatMenuTrigger) menu!: MatMenuTrigger;

  hasOpenedMail = false;

  ngOnInit() {
    setTimeout(() => {
      this.webSocketService.emmit({ message: 'Hello from Angular' });
    }, 1000);


    this.webSocketService.get().subscribe(console.log);
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


  changeOpenedMail() {
    if (!this.hasOpenedMail)
      this.hasOpenedMail = true;

    this.menu.menuClosed.subscribe(_ => this.hasOpenedMail = false);
    this.menu.menuOpened.subscribe(_ => this.hasOpenedMail = true);
  }

  reload() {
    this.router.navigate(['/chat'])
      .then(() => {
        window.location.reload();
      });
  }

  logout() {
    this.cookieService.delete('access_token', '/');
    this.reload();
  }
}
