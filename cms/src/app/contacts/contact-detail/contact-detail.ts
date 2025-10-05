import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Contact } from '../contact.model';

@Component({
  selector: 'cms-contact-detail',
  templateUrl: './contact-detail.html',
  styleUrls: ['./contact-detail.css'],
  standalone: false // explicitly non-standalone
})
export class ContactDetailComponent {
  @Input() contact!: Contact;                // The selected contact
  @Output() editContact = new EventEmitter<Contact>();     // Emit updated contact
  @Output() deleteContact = new EventEmitter<Contact>();   // Emit contact to delete

  // Called when user clicks "Edit" button
  onEdit() {
    this.editContact.emit(this.contact);
  }

  // Called when user clicks "Delete" button
  onDelete() {
    this.deleteContact.emit(this.contact);
  }
}
