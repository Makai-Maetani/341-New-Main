import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Contact } from '../contact.model';

@Component({
  selector: 'cms-contact-item',
  standalone: false,
  templateUrl: './contact-item.html',
  styleUrls: ['./contact-item.css']
})
export class ContactItemComponent {
  @Input() contact!: Contact;
  @Output() contactSelected = new EventEmitter<void>();

  onSelected() {
    this.contactSelected.emit();
  }
}
