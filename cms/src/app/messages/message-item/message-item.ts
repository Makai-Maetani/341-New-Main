import { Component, Input } from '@angular/core';
import { Message } from '../messages.model';

@Component({
  selector: 'cms-message-item',
  standalone: false,
  templateUrl: './message-item.html',
  styleUrls: ['./message-item.css']
})
export class MessageItemComponent {
  @Input() message!: Message;
}
