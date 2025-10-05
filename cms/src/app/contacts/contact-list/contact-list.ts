import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Contact } from '../contact.model';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.html',
  styleUrls: ['./contact-list.css'],
  standalone: false // ✅ explicitly non-standalone
})
export class ContactListComponent {
  @Input() contacts: Contact[] = [];
  @Output() selectedContact = new EventEmitter<Contact>();

  onSelected(contact: Contact) {
    this.selectedContact.emit(contact);
  }
}
