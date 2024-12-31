import { Component, Injectable } from '@angular/core';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { FormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { ConversationComponent } from "../conversation/conversation.component";

@Component({
  selector: 'app-text',
  imports: [
    TruncatePipe,
    FormsModule,
    NgStyle,
    ConversationComponent
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

  constructor(
    private router: Router,
  ) { }

  searchValue: string = '';
  hasClickedConversation: boolean = false;
  clickedConversationId: number = 0;
  inputConversation: any;
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
