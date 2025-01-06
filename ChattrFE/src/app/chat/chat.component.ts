import { Component, inject, Injectable, OnInit } from '@angular/core';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgStyle } from '@angular/common';
import { Router } from '@angular/router';
import { MessageComponent } from "../message/message.component";
import { ConversationProperties } from '../models/conversation-properties.interface';
import { ChatService } from './chat.service';
import { AuthService } from '../auth/services/auth.service';
import { filter, firstValueFrom, last, map, Observable, switchMap, take, tap } from 'rxjs';
import { Conversation } from '../models/conversation.interface';
import { UserService } from '../services/user.service';
import { Message } from '../models/message.interface';
import { User } from '../models/user.interface';
import { MessageService } from '../message/message.service';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { iconSVG } from '../utils/iconSVG';

@Component({
  selector: 'app-chat',
  imports: [
    TruncatePipe,
    FormsModule,
    NgStyle,
    MessageComponent,
    DatePipe,
    MatIconModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {

  constructor(
    private router: Router,
    private chatService: ChatService,
    private authService: AuthService,
    private userService: UserService,
    private messageService: MessageService
  ) {
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);

    iconRegistry.addSvgIconLiteral('new-message', sanitizer.bypassSecurityTrustHtml(iconSVG.newMessage));
    iconRegistry.addSvgIconLiteral('close', sanitizer.bypassSecurityTrustHtml(iconSVG.close));
  }

  ngOnInit() {
    this.getAllConversationProperties$()
      .subscribe({
        next: async (conversationProperties) => {
          this.conversationsProperties = conversationProperties;
          await this.assignConversations();
        },
        error: (error) => {
          console.error(error);
        }
      });

  }

  searchUser: string = '';
  searchAddUser: string = '';
  hasClickedConversation: boolean = false;
  clickedConversationId!: number;
  inputConversation!: Conversation;
  conversationsProperties: ConversationProperties[] = [];
  yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
  conversations: Conversation[] = [];
  hasClickedAddingUser: boolean = false;
  isAddingUser: boolean = false;


  isYesterday(timestamp: Date) {
    const yesterdayStart = new Date(this.yesterday.setHours(0, 0, 0, 0));
    const yesterdayEnd = new Date(this.yesterday.setHours(23, 59, 59, 999));
    const conversationTime = new Date(timestamp).getTime();

    return conversationTime >= yesterdayStart.getTime() && conversationTime <= yesterdayEnd.getTime();
  }

  getAllConversationProperties$() {
    return this.authService.user$
      .pipe(
        filter(
          (user) => user.id !== 0),
        switchMap(
          (user) =>
            this.chatService.getAllConversationPropertiesFromUserId$(user.id)
        ),
      );
  }

  addingUser() {
    this.isAddingUser = !this.isAddingUser;
    setTimeout(() => {
      this.hasClickedAddingUser = !this.hasClickedAddingUser;
      this.isAddingUser = !this.isAddingUser;
      setTimeout(() => {
        this.isAddingUser = !this.isAddingUser;
      }, 1);
    }, 300);
  }

  async assignConversations() {
    this.conversations = (await this.aggregateConversations())
      .sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
  }


  async aggregateConversations() {
    const conversations: Conversation[] = [];

    await Promise.all(
      this.conversationsProperties
        .map(async (conversationProperty) => {

          const conversation: Conversation = {
            id: conversationProperty.id,
            userName: "",
            lastMessage: "",
            timestamp: new Date(),
            lastMessageIsRead: false
          };

          const askedUser = await this.getFirstValueFrom<User>(
            this.userService.getOneById$(conversationProperty.askedUserId)
          );

          const createrUser = await this.getFirstValueFrom<User>(
            this.userService.getOneById$(conversationProperty.createrUserId)
          );

          if (conversationProperty.askedUserId == this.authService.user$.getValue().id) {
            conversation.userName = `${createrUser.firstName} ${createrUser.lastName}`;
          } else {
            conversation.userName = `${askedUser.firstName} ${askedUser.lastName}`;
          }


          const lastMessage = await this.getFirstValueFrom<Message>(
            this.messageService.getLastMessageFromConversationId$(conversationProperty.id)
          );

          if (lastMessage) {
            if (lastMessage.timestamp) {
              conversation.timestamp = lastMessage.timestamp;
            }

            if (lastMessage) {
              conversation.lastMessage = lastMessage.message;
            } else {
              conversation.lastMessage = "";
            }

            if (lastMessage.senderId == this.authService.user$.getValue().id) {
              conversation.lastMessageIsRead = true;
            } else {
              conversation.lastMessageIsRead = lastMessage.isRead;
            }

          }

          conversations.push(conversation);
        })

    );
    return conversations;
  }

  changeLastMessageColor(conversation: Conversation) {
    if (!conversation.lastMessageIsRead &&
      !(conversation.id == this.clickedConversationId && this.hasClickedConversation)) {
      return {
        'color': 'var(--dark-white)',
        'font-weight': 'bold'
      };
    }
    if (conversation.id == this.clickedConversationId && this.hasClickedConversation) {
      return {
        'color': 'rgb(189, 195, 196)'
      };
    }
    return null;
  }

  async getFirstValueFrom<T>(observable: Observable<T>) {
    return await firstValueFrom(observable);
  }

  getConversation(conversation: Conversation) {
    //Not affecting backend
    conversation.lastMessageIsRead = true;

    this.inputConversation = conversation;
    this.clickedConversationId = conversation.id;
    this.hasClickedConversation = true;
    this.router.navigate(['/chat/conversation']);
  }
}

