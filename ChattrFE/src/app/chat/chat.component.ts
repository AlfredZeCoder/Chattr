import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, NgStyle } from '@angular/common';
import { Router } from '@angular/router';
import { MessageComponent } from "../message/message.component";
import { AuthService } from '../auth/services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { Conversation } from '../models/conversation.interface';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { iconSVG } from '../utils/iconSVG';
import { PendingRequestService } from '../pending-request/pending-request.service';
import { ConversationComponent } from './conversation/conversation.component';

@Component({
  selector: 'app-chat',
  imports: [
    FormsModule,
    NgStyle,
    MessageComponent,
    MatIconModule,
    AsyncPipe,
    ConversationComponent,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {

  constructor(
    private pendingRequestService: PendingRequestService,
    private authService: AuthService,
    private router: Router
  ) {
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);

    iconRegistry.addSvgIconLiteral('new-message', sanitizer.bypassSecurityTrustHtml(iconSVG.newMessage));
    iconRegistry.addSvgIconLiteral('close', sanitizer.bypassSecurityTrustHtml(iconSVG.close));
  }
  ngOnInit(): void {
    if (!this.inputConversation) {
      this.router.navigate(['/chat']);
    }
  }

  searchUser: string = '';
  searchAddUser: string = '';
  hasClickedAddingUser: boolean = false;
  hasClickedConversation: boolean = false;
  inputConversation!: Conversation;
  isAddingUser: boolean = false;
  emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  isEmailInvalid$ = new BehaviorSubject<boolean>(false);
  hasAddedUser = false;

  updateUserAddingStatus() {
    this.isAddingUser = !this.isAddingUser;
    setTimeout(() => {
      this.hasClickedAddingUser = !this.hasClickedAddingUser;
      this.isAddingUser = !this.isAddingUser;
      setTimeout(() => {
        this.isAddingUser = !this.isAddingUser;
      }, 1);
    }, 300);
  }

  addUser = () => {
    this.hasAddedUser = true;
    this.checkEmailValidity();

    if (!this.isEmailInvalid$.getValue()) {
      this.pendingRequestService.addPendingRequest$(this.searchAddUser, this.authService.user$.getValue().id)
        .subscribe({
          next: () => {
            this.hasAddedUser = false;
            this.searchAddUser = '';
            this.updateUserAddingStatus();
          },
          error: () => {
            this.hasAddedUser = false;
            this.searchAddUser = '';
            this.updateUserAddingStatus();
          },
        });
    }
  };

  getConversation(conversation: Conversation) {
    this.hasClickedConversation = true;
    this.inputConversation = conversation;
    this.router.navigate(['/chat/conversation']);
  }

  checkEmailValidity() {
    if (!this.searchAddUser.match(this.emailRegex)) {
      this.isEmailInvalid$.next(true);
    } else {
      this.isEmailInvalid$.next(false);
    }
  }
}

