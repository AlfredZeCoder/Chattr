import { Component, Injectable, OnInit } from '@angular/core';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { FormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';
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

@Component({
  selector: 'app-chat',
  imports: [
    TruncatePipe,
    FormsModule,
    NgStyle,
    MessageComponent
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {

  constructor(
    private router: Router,
    private chatService: ChatService,
    private authService: AuthService,
    private userService: UserService
  ) { }

  async ngOnInit() {
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

  searchValue: string = '';
  hasClickedConversation: boolean = false;
  clickedConversationId!: number;
  inputConversation!: Conversation;

  conversationsProperties: ConversationProperties[] = [];

  conversations: Conversation[] = [];

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

  async assignConversations() {
    this.conversations = (await this.aggregateConversations())
      .sort((a, b) => b.time.localeCompare(a.time));
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
            time: ""
          };

          const askedUser = await this.getFirstValueFrom<User>(
            this.userService.getOneById$(conversationProperty.askedUserId)
          );

          conversation.userName = `${askedUser.firstName} ${askedUser.lastName}`;

          const lastMessage = await this.getFirstValueFrom<Message>(
            this.chatService.getLastMessageFromConversationId$(conversationProperty.id)
          );

          conversation.time = lastMessage ? this.getConversationTime(lastMessage.timestamp) : "";

          if (lastMessage) {
            conversation.lastMessage = lastMessage.message;
          } else {
            conversation.lastMessage = "";
          }

          conversations.push(conversation);

        })
    );
    return conversations;
  }

  getConversationTime(timestamp: Date) {
    return `${String(new Date(timestamp).getHours()).padStart(2, '0')}:${String(new Date(timestamp).getMinutes()).padStart(2, '0')}`;
  }

  async getFirstValueFrom<T>(observable: Observable<T>) {
    return await firstValueFrom(observable);
  }

  getConversation(conversation: Conversation) {
    this.inputConversation = conversation;
    this.clickedConversationId = conversation.id;
    this.hasClickedConversation = true;
    this.router.navigate(['/chat/conversation']);
  }





}
