import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { AuthService } from '../auth/services/auth.service';
import { filter, from, map, mergeMap, Observable, switchMap, tap } from 'rxjs';
import { User } from '../shared/models/user.interface';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon, MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { iconSVG } from '../shared/utils/iconSVG';
import { NgStyle } from '@angular/common';
import { PendingRequestService } from './pending-request.service';

@Component({
  selector: 'app-pending-request',
  imports: [
    MatMenuModule,
    MatIconModule,
  ],
  templateUrl: './pending-request.component.html',
  styleUrl: './pending-request.component.css'
})
export class PendingRequestComponent implements OnInit {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private pendingRequestService: PendingRequestService
  ) {
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);

    iconRegistry.addSvgIconLiteral('addCircle', sanitizer.bypassSecurityTrustHtml(iconSVG.addCircle));
    iconRegistry.addSvgIconLiteral('cancel', sanitizer.bypassSecurityTrustHtml(iconSVG.cancel));
  }

  ngOnInit(): void {
    this.authService.user$.pipe(
      filter(user => user.id !== 0),
      switchMap(user => from(user.pendingUserIdRequests)),
      mergeMap(id => this.userService.getOneById$(id))
    ).subscribe({
      next: user => {
        this.pendingRequests.push(user);
      }
    });


  }

  pendingRequests: Array<User> = [];

  acceptRequest(id: number) {
    this.pendingRequestService.acceptPendingRequest$(this.authService.user$.getValue().id, id)
      .subscribe({
        next: (conversation) => {
          this.pendingRequests = this.pendingRequests.filter(user => user.id !== id);
          this.authService.user$.getValue().pendingUserIdRequests = this.authService.user$.getValue().pendingUserIdRequests.filter(userId => userId !== id);
        }
      });
  }

  deleteRequest(id: number) {
    this.pendingRequestService.deletePendingRequest$(this.authService.user$.getValue().id, id)
      .subscribe({
        next: () => {
          this.pendingRequests = this.pendingRequests.filter(user => user.id !== id);
          this.authService.user$.getValue().pendingUserIdRequests = this.authService.user$.getValue().pendingUserIdRequests.filter(userId => userId !== id);
        }
      });
  }

}
