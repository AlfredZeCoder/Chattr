import { Component, EventEmitter, input, OnInit, output, Output } from '@angular/core';
import { Conversation } from '../../models/conversation.interface';
import { Router } from '@angular/router';
import { DatePipe, NgStyle } from '@angular/common';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { AuthService } from '../../auth/services/auth.service';
import { BehaviorSubject, filter, firstValueFrom, Observable, Subject, switchMap } from 'rxjs';
import { ChatService } from '../chat.service';
import { ConversationProperties } from '../../models/conversation-properties.interface';
import { UserService } from '../../services/user.service';
import { MessageService } from '../../message/message.service';
import { User } from '../../models/user.interface';
import { Message } from '../../models/message.interface';

@Component({
  selector: 'app-conversation',
  imports: [
    NgStyle,
    DatePipe,
    TruncatePipe
  ],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.css'
})
export class ConversationComponent implements OnInit {

  // @Output() conversation = new EventEmitter<Conversation>();
  conversation = output<Conversation>();

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private userService: UserService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
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

  hasClickedConversation: boolean = false;
  clickedConversationId!: number;
  conversations: Conversation[] = [];
  conversationsProperties: ConversationProperties[] = [];
  searchUser: string = '';
  yesterday = new Date(new Date().setDate(new Date().getDate() - 1));

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

          if (!lastMessage) {
            conversation.lastMessage = "No messages yet";
            conversation.lastMessageIsRead = true;
          }

          if (lastMessage) {
            conversation.lastMessage = lastMessage.message;

            if (lastMessage.timestamp) {
              conversation.timestamp = lastMessage.timestamp;
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


  async getFirstValueFrom<T>(observable: Observable<T>) {
    return await firstValueFrom(observable);
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


  getConversation(conversation: Conversation) {
    this.conversation.emit(conversation);

    //Not affecting backend
    conversation.lastMessageIsRead = true;

    this.clickedConversationId = conversation.id;
    this.hasClickedConversation = true;
  }
}
