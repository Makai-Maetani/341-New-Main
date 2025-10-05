import { Component } from '@angular/core';
import { Message } from '../messages.model';

@Component({
  selector: 'cms-message-list',
  standalone: false,
  templateUrl: './message-list.html',
  styleUrls: ['./message-list.css']
})
export class MessageListComponent {
  messages: Message[] = [
    new Message(1, 'Test', 'Hello', 'This is a test messsage!'),
    new Message(2, 'Reimu', 'Project', 'This is a lot of stuff to do in the first 2 weeks'),
    new Message(3, 'Marisa', 'Update', 'I hope Im able to keep up with everything')
  ];

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
