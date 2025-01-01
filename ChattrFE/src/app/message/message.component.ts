import { NgStyle } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-conversation',
  imports: [
    NgStyle,
    FormsModule,
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements OnInit, AfterViewInit {

  @Input() conversation: any;

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.scrollToBottom("ngAfterViewInit");
  }
  @ViewChild('chatContainer')
  chatContainer?: ElementRef;

  newText: string = '';
  userId: number = 1;

  mockTexts = [
    {
      id: 1,
      conversationId: 1,
      message: 'Hello!',
      senderId: 1,
      timestamp: new Date('2023-10-01T10:00:00')
    },

    {
      id: 2,
      conversationId: 1,
      message: 'Hi there!',
      senderId: 2,
      timestamp: new Date('2023-10-01T10:01:00')
    },
    {
      id: 3,
      conversationId: 2,
      message: 'How are you?',
      senderId: 1,
      timestamp: new Date('2023-10-01T10:02:00')
    },
    {
      id: 4,
      conversationId: 2,
      message: 'I am good, thanks!',
      senderId: 2,
      timestamp: new Date('2023-10-01T10:03:00')
    },
    {
      id: 5,
      conversationId: 3,
      message: 'What about you?',
      senderId: 1,
      timestamp: new Date('2023-10-01T10:04:00')
    },
    {
      id: 6,
      conversationId: 3,
      message: 'I am doing well.',
      senderId: 2,
      timestamp: new Date('2023-10-01T10:05:00')
    },
    {
      id: 7,
      conversationId: 4,
      message: 'Great to hear!',
      senderId: 1,
      timestamp: new Date('2023-10-01T10:06:00')
    },
    {
      id: 8,
      conversationId: 4,
      message: 'Yes, indeed.',
      senderId: 2,
      timestamp: new Date('2023-10-01T10:07:00')
    },
    {
      id: 9,
      conversationId: 5,
      message: 'What are you up to?',
      senderId: 1,
      timestamp: new Date('2023-10-01T10:08:00')
    },
    {
      id: 10,
      conversationId: 5,
      message: 'Just working on a project.',
      senderId: 2,
      timestamp: new Date('2023-10-01T10:09:00')
    },
    {
      id: 11,
      conversationId: 6,
      message: 'Sounds interesting!',
      senderId: 1,
      timestamp: new Date('2023-10-01T10:10:00')
    },
    {
      id: 12,
      conversationId: 6,
      message: 'It is!',
      senderId: 2,
      timestamp: new Date('2023-10-01T10:11:00')
    },
    {
      id: 13,
      conversationId: 7,
      message: 'Good luck with it.',
      senderId: 1,
      timestamp: new Date('2023-10-01T10:12:00')
    },
    {
      id: 14,
      conversationId: 7,
      message: 'Thank you!',
      senderId: 2,
      timestamp: new Date('2023-10-01T10:13:00')
    },
    {
      id: 15,
      conversationId: 8,
      message: 'You are welcome.',
      senderId: 1,
      timestamp: new Date('2023-10-01T10:14:00')
    },
    {
      id: 16,
      conversationId: 8,
      message: 'Have a great day!',
      senderId: 2,
      timestamp: new Date('2023-10-01T10:15:00')
    },
    {
      id: 17,
      conversationId: 9,
      message: 'You too!',
      senderId: 1,
      timestamp: new Date('2023-10-01T10:16:00')
    },
    {
      id: 18,
      conversationId: 9,
      message: 'I am good, how about you?',
      senderId: 2,
      timestamp: new Date('2023-10-01T10:17:00')
    },
    {
      id: 19,
      conversationId: 10,
      message: 'I am good too',
      senderId: 1,
      timestamp: new Date('2023-10-01T10:18:00')
    },
    {
      id: 20,
      conversationId: 10,
      message: 'That is good to hear',
      senderId: 2,
      timestamp: new Date('2023-10-01T10:19:00')
    },
    {
      id: 21,
      conversationId: 11,
      message: 'Hello, how are you?',
      senderId: 1,
      timestamp: new Date('2023-10-01T10:20:00')
    },
    {
      id: 22,
      conversationId: 11,
      message: 'I am good, how about you?',
      senderId: 2,
      timestamp: new Date('2023-10-01T10:21:00')
    },
    {
      id: 23,
      conversationId: 12,
      message: 'I am good too',
      senderId: 1,
      timestamp: new Date('2023-10-01T10:22:00')
    },
    {
      id: 24,
      conversationId: 12,
      message: 'That is good to hear',
      senderId: 1,
      timestamp: new Date('2023-10-01T10:23:00')
    },
    {
      id: 25,
      conversationId: 1,
      message: 'Hello!',
      senderId: 1,
      timestamp: new Date('2023-10-01T10:24:00')
    },
  ].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());


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
    this.mockTexts.push({
      id: this.mockTexts.length + 1,
      conversationId: this.conversation.id,
      message: message,
      senderId: this.userId,
      timestamp: new Date()
    });
    this.newText = '';

  }

}
