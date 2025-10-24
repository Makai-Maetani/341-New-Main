import { Component, OnInit } from '@angular/core';
import { Message } from '../messages.model';
import { MessageService } from '../messages.service';

@Component({
  selector: 'cms-message-list',
  standalone: false,
  templateUrl: './message-list.html',
  styleUrls: ['./message-list.css']
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [];

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    // Initialize messages from the service
    this.messages = this.messageService.getMessages();

    // Subscribe to changes so the list updates when new messages are added
    this.messageService.messageChangedEvent.subscribe((messages: Message[]) => {
      this.messages = messages;
    });
  }

  // Add a new message via the service so it's persisted in the service's array
  onAddMessage(message: Message) {
    this.messageService.addMessage(message);
  }
}
