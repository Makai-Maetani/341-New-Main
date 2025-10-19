import { Component } from '@angular/core';
import { Message } from '../messages.model';
import { MOCKMESSAGES } from '../MOCKMESSAGES';

@Component({
  selector: 'cms-message-list',
  standalone: false,
  templateUrl: './message-list.html',
  styleUrls: ['./message-list.css']
})
export class MessageListComponent {
  // Initialize messages with the mock data
  messages: Message[] = [...MOCKMESSAGES];

  // Add a new message to the list
  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
