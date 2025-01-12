import { NgStyle } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Conversation } from '../../shared/models/conversation.interface';
import { Message } from '../../shared/models/message.interface';
import { MessageService } from './message.service';
import { AuthService } from '../../auth/services/auth.service';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { iconSVG } from '../../shared/utils/iconSVG';
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
export class MessageComponent implements OnInit, AfterViewInit, OnChanges {

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
  ) {
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);

    iconRegistry.addSvgIconLiteral('arrow-up', sanitizer.bypassSecurityTrustHtml(iconSVG.arrowUp));
  }


  @Input() conversation!: Conversation;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conversation']) {
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
    this.getMessagesFromConversation(this.conversation.id);

  }

  getMessagesFromConversation(conversationId: number) {
    this.messageService.getMessagesFromConversation$(conversationId)
      .subscribe(
        (messages) => {
          this.messages = messages;
          this.messages.forEach((message) => {
            if (message.senderId !== this.authService.user$.getValue().id && !message.isRead) {
              this.changeReadStatus(message);
            }
          });
        }
      );

  }

  ngAfterViewInit(): void {
    this.scrollToBottom("ngAfterViewInit");
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


  scrollToBottom(from: string): void {
    setTimeout(() => {
      const container = this.chatContainer!.nativeElement;
      container.scroll({
        top: container.scrollHeight,
        behavior: from == "ngAfterViewInit" ? 'auto' : 'smooth'
      });
    }, 0);
  }

  sendMessage(message: string) {
    this.scrollToBottom("sendMessage");
    const newMessage: Message = {
      id: 0,
      conversationId: this.conversation!.id,
      message: message,
      senderId: this.userId,
      timestamp: new Date(),
      isRead: false
    };
    this.messages.push(newMessage);
    this.messageService.sendMessage$(newMessage)
      .subscribe();

    this.newText = '';

  }

}
