import { Component, OnInit, output } from '@angular/core';
import { Conversation } from '../../../shared/models/conversation.interface';
import { DatePipe, NgStyle } from '@angular/common';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { AuthService } from '../../../shared/auth/services/auth.service';
import { filter, firstValueFrom, Observable, switchMap } from 'rxjs';
import { ChatService } from '../services/chat.service';
import { ConversationProperties } from '../../../shared/models/conversation-properties.interface';
import { UserService } from '../../../shared/services/user.service';
import { MessageService } from '../../message/services/message.service';
import { User } from '../../../shared/models/user.interface';
import { Message } from '../../../shared/models/message.interface';
import { MessageWebSocketsService } from '../../message/services/message-websocket.service';

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
    private messageService: MessageService,
    private messageWebSocketsService: MessageWebSocketsService
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

  isToday(timestamp: Date) {
    const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
    const todayEnd = new Date(new Date().setHours(23, 59, 59, 999));
    const conversationTime = new Date(timestamp).getTime();

    return conversationTime >= todayStart.getTime() && conversationTime <= todayEnd.getTime();
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

  joinConversationRoom(conversation: Conversation) {
    this.messageWebSocketsService.getRoomHash(conversation.id)
      .subscribe({
        next: (roomHash) => {
          this.messageWebSocketsService.joinRoom(roomHash);
        }
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
          this.joinConversationRoom(conversation);
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
