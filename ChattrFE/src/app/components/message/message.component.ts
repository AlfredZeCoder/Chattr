import { NgStyle } from '@angular/common';
import { Component, ElementRef, inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Conversation } from '../../shared/models/conversation.interface';
import { Message } from '../../shared/models/message.interface';
import { MessageService } from './services/message.service';
import { AuthService } from '../../shared/auth/services/auth.service';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { iconSVG } from '../../shared/utils/iconSVG';
import { MessageWebSocketsService } from './services/message-websocket.service';
import { Room } from './models/room.interface';
@Component({
  selector: 'app-message',
  imports: [
    NgStyle,
    FormsModule,
    MatIconModule
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
})
export class MessageComponent implements OnInit, OnChanges {

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private messageWebSocketsService: MessageWebSocketsService
  ) {
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);

    iconRegistry.addSvgIconLiteral('arrow-up', sanitizer.bypassSecurityTrustHtml(iconSVG.arrowUp));
  }

  @Input() conversation!: Conversation;

  room!: Room;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conversation']) {
      this.getRoomHash(this.conversation.id);
      this.getMessagesFromConversation(this.conversation.id);
    }
  }

  ngOnInit(): void {
    this.authService.user$
      .subscribe(
        (user) => {
          this.userId = user.id;
        }
      );
    this.receiveMessage();
  }

  getRoomHash(id: number) {
    this.messageWebSocketsService.getRoomHash(id)
      .subscribe({
        next: (room) => {
          this.room = room;
        }
      });
  }

  getMessagesFromConversation(conversationId: number) {
    this.messageService.getMessagesFromConversation$(conversationId)
      .subscribe({
        next: (messages) => {
          this.messages = messages;
          this.orderMessages();

          Promise.resolve().then(() => {
            this.scrollToBottom("afterRender");
          });

          this.messages.forEach((message) => {
            if (message.senderId !== this.authService.user$.getValue().id && !message.isRead) {
              this.changeReadStatus(message);
            }
          });
        }
      });

  }

  @ViewChild('chatContainer')
  chatContainer?: ElementRef;

  changeReadStatus(message: Message) {
    this.messageService.changeMessageReadStatus$(message.id)
      .subscribe();
    message.isRead = true;
  }

  newText: string = '';
  userId!: number;
  messages: Message[] = [];

  orderMessages() {
    this.messages.sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
  }

  scrollToBottom(from: string): void {
    setTimeout(() => {
      const container = this.chatContainer!.nativeElement;
      container.scroll({
        top: container.scrollHeight,
        behavior: from == "afterRender" ? 'auto' : 'smooth'
      });
    }, 0);
  }

  sendMessage(message: string) {
    const newMessage: Message = {
      id: 0,
      conversationId: this.conversation!.id,
      message: message,
      senderId: this.userId,
      timestamp: new Date(),
      isRead: false
    };
    this.messages.push(newMessage);
    this.messageWebSocketsService.sendMessageToRoom(this.room, newMessage);
    this.newText = '';
    this.scrollToBottom('');
  }

  receiveMessage() {
    this.messageWebSocketsService.onEvent<{ room: Room, message: Message; }>('receiveMessageFromMessageRoom')
      .subscribe({
        next: (data) => {
          if (data.message.senderId !== this.authService.user$.getValue().id && data.room.roomHash === this.room.roomHash) {
            this.messages.push(data.message);
            this.changeReadStatus(data.message);
            this.scrollToBottom('');
          }
        }
      });
  }

}
