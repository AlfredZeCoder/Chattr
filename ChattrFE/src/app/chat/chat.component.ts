import { Component, Injectable, OnInit } from '@angular/core';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { FormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { Router } from '@angular/router';
import { MessageComponent } from "../message/message.component";
import { ConversationProperties } from '../models/conversation-properties.interface';
import { ChatService } from './chat.service';
import { AuthService } from '../auth/services/auth.service';
import { filter, firstValueFrom, map, switchMap, take } from 'rxjs';
import { Conversation } from '../models/conversation.interface';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-text',
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

  ngOnInit() {
    this.authService.user$
      .pipe(
        filter(
          (user) => user.id !== 0),
        switchMap(
          (user) =>
            this.chatService.getAllConversationPropertiesFromUserId$(user.id)
        ),
      )
      .subscribe((conversationProperties) => {
        this.conversationsProperties = conversationProperties;
        this.conversations = this.aggregateConversations();
        this.conversations.map((conversation) => console.log(conversation));
        console.log(this.conversationsProperties);
      });

    // console.log(this.aggregateConversations());
  }

  searchValue: string = '';
  hasClickedConversation: boolean = false;
  clickedConversationId: number = 0;
  inputConversation: any;

  conversationsProperties: ConversationProperties[] = [];

  conversations: Conversation[] = [];

  aggregateConversations() {
    const conversations: Conversation[] = [];

    this.conversationsProperties
      .map((conversationProperty) => {
        const conversation: Conversation = {
          id: conversationProperty.id,
          userName: "",
          lastMessage: "",
          time: new Date().getHours() + ':' + new Date().getMinutes()
        };

        this.userService.getOneById$(conversationProperty.askedUserId)
          .subscribe((user) => {
            conversation.userName = user.firstName + ' ' + user.lastName;
          });

        this.chatService.getLastMessageFromConversationId$(conversationProperty.id)
          .subscribe((lastMessage) => {
            console.log(lastMessage);
            conversation.lastMessage = lastMessage.message;
          });
        conversations.push(conversation);
      });
    return conversations;
  }
  mockConversations = [
    {
      id: 1,
      name: 'Jean-Francois Poirier',
      lastMessage: 'Hello, how are you? adslkfjhasdlkfjhasldkfjhasdlkfjhasdlkfjhasdlkfjhasdlkfjahsdlfkjh',
      time: '10:54'
    },
    {
      id: 2,
      name: 'Jane Doe',
      lastMessage: 'I am good, how about you?',
      time: '10:25'
    },
    {
      id: 3,
      name: 'John Doe',
      lastMessage: 'I am good too',
      time: '10:54'
    },
    {
      id: 4,
      name: 'Alfred Poirier',
      lastMessage: 'That is good to hear',
      time: '10:25'
    },
    {
      id: 5,
      name: 'John Doe',
      lastMessage: 'Hello, how are you?',
      time: '10:54'
    },
    {
      id: 6,
      name: 'Jane Doe',
      lastMessage: 'I am good, how about you?',
      time: '10:25'
    },
    {
      id: 7,
      name: 'John Doe',
      lastMessage: 'I am good too',
      time: '10:54'
    },
    {
      id: 8,
      name: 'Jane Doe',
      lastMessage: 'That is good to hear',
      time: '10:25'
    },
    {
      id: 9,
      name: 'John Doe',
      lastMessage: 'Hello, how are you?',
      time: '10:54'
    },
    {
      id: 10,
      name: 'Jane Doe',
      lastMessage: 'I am good, how about you?',
      time: '10:25'
    },
    {
      id: 11,
      name: 'John Doe',
      lastMessage: 'I am good too',
      time: '10:54'
    },
    {
      id: 12,
      name: 'Jane Doe',
      lastMessage: 'That is good to hear',
      time: '10:25'
    },
    {
      id: 13,
      name: 'John Doe',
      lastMessage: 'Hello, how are you?',
      time: '10:54'
    },
    {
      id: 14,
      name: 'Jane Doe',
      lastMessage: 'I am good, how about you?',
      time: '10:25'
    },
    {
      id: 15,
      name: 'John Doe',
      lastMessage: 'I am good too',
      time: '10:54'
    },
    {
      id: 16,
      name: 'Jane Doe',
      lastMessage: 'That is good to hear',
      time: '10:25'
    },
    {
      id: 17,
      name: 'John Doe',
      lastMessage: 'Hello, how are you?',
      time: '10:54'
    },
    {
      id: 18,
      name: 'Jane Doe',
      lastMessage: 'I am good, how about you?',
      time: '10:25'
    },
    {
      id: 19,
      name: 'John Doe',
      lastMessage: 'I am good too',
      time: '10:54'
    },
    {
      id: 20,
      name: 'Jane Doe',
      lastMessage: 'That is good to hear',
      time: '10:25'
    },
    {
      id: 21,
      name: 'John Doe',
      lastMessage: 'Hello, how are you?',
      time: '10:54'
    },
    {
      id: 22,
      name: 'Jane Doe',
      lastMessage: 'I am good, how about you?',
      time: '10:25'
    },
    {
      id: 23,
      name: 'John Doe',
      lastMessage: 'I am good too',
      time: '10:54'
    },
    {
      id: 24,
      name: 'Jane Doe',
      lastMessage: 'That is good to hear',
      time: '10:25'
    },
    {
      id: 25,
      name: 'John Doe',
      lastMessage: 'Hello, how are you?',
      time: '10:54'
    },
    {
      id: 26,
      name: 'Jane Doe',
      lastMessage: 'I am good, how about you?',
      time: '10:25'
    },
    {
      id: 27,
      name: 'John Doe',
      lastMessage: 'I am good too',
      time: '10:54'
    },
    {
      id: 28,
      name: 'Jane Doe',
      lastMessage: 'That is good to hear',
      time: '10:25'
    },
    {
      id: 29,
      name: 'John Doe',
      lastMessage: 'Hello, how are you?',
      time: '10:54'
    },
    {
      id: 30,
      name: 'Jane Doe',
      lastMessage: 'I am good, how about you?',
      time: '10:25'
    }
  ];

  getConversation(conversation: any) {
    this.inputConversation = conversation;
    this.clickedConversationId = conversation.id;
    this.hasClickedConversation = true;
    this.router.navigate(['/chat/conversation']);
  }



}
