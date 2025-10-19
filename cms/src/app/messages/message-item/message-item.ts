import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../messages.model';
import { ContactService } from '../../contacts/contact.service';
import { Contact } from '../../contacts/contact.model';



@Component({
  selector: 'cms-message-item',
  standalone: false,
  templateUrl: './message-item.html',
  styleUrls: ['./message-item.css']
})
export class MessageItemComponent implements OnInit {
  @Input() message!: Message;
  messageSender: string = '';

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    const contact = this.contactService.getContact(this.message.sender);
    this.messageSender = contact ? contact.name : 'Unknown';
  }
}
