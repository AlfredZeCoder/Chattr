import { NgStyle } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Conversation } from '../models/conversation.interface';
import { Message } from '../models/message.interface';
import { MessageService } from './message.service';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-message',
  imports: [
    NgStyle,
    FormsModule,
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements OnInit, AfterViewInit, OnChanges {

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
  ) { }


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
        }
      );
  }

  ngAfterViewInit(): void {
    this.scrollToBottom("ngAfterViewInit");
  }

  @ViewChild('chatContainer')
  chatContainer?: ElementRef;

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
      timestamp: new Date()
    };
    this.messages.push(newMessage);
    this.messageService.sendMessage$(newMessage)
      .subscribe();

    this.newText = '';

  }

}
