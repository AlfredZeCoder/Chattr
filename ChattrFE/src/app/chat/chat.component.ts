import { Component, Injectable, OnInit } from '@angular/core';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { FormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { Router } from '@angular/router';
import { MessageComponent } from "../message/message.component";
import { ConversationProperties } from '../models/conversation-properties.interface';
import { ChatService } from './chat.service';
import { AuthService } from '../auth/services/auth.service';
import { filter, firstValueFrom, last, map, switchMap, take, tap } from 'rxjs';
import { Conversation } from '../models/conversation.interface';
import { UserService } from '../services/user.service';
import { Message } from '../models/message.interface';

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
    this.authService.user$
      .pipe(
        filter(
          (user) => user.id !== 0),
        switchMap(
          (user) =>
            this.chatService.getAllConversationPropertiesFromUserId$(user.id)
        ),
      )
      .subscribe(async (conversationProperties) => {
        this.conversationsProperties = conversationProperties;
        this.conversations = (await this.aggregateConversations())
          .sort((a, b) => b.time.localeCompare(a.time));
      });
  }

  searchValue: string = '';
  hasClickedConversation: boolean = false;
  clickedConversationId: number = 0;
  inputConversation!: Conversation;

  conversationsProperties: ConversationProperties[] = [];

  conversations: Conversation[] = [];

  async aggregateConversations() {
    const conversations: Conversation[] = [];

    await Promise.all(
      this.conversationsProperties
        .map(async (conversationProperty) => {
          const conversation: Conversation = {
            id: conversationProperty.id,
            userName: "",
            lastMessage: "",
            time: new Date().getHours() + ':' + String(new Date().getMinutes()).padStart(2, '0')
          };

          const user = await firstValueFrom(
            this.userService.getOneById$(conversationProperty.askedUserId)
          );
          conversation.userName = `${user.firstName} ${user.lastName}`;

          const lastMessage = await firstValueFrom(
            this.chatService.getLastMessageFromConversationId$(conversationProperty.id)
          );

          conversation.time = lastMessage ? `${String(new Date(lastMessage.timestamp).getHours()).padStart(2, '0')}:
          ${String(new Date(lastMessage.timestamp).getMinutes()).padStart(2, '0')}`
            : "";
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

  getConversation(conversation: Conversation) {
    this.inputConversation = conversation;
    this.clickedConversationId = conversation.id;
    this.hasClickedConversation = true;
    this.router.navigate(['/chat/conversation']);
  }





}
