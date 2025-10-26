import { Component, OnInit, Input } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.html',
  styleUrls: ['./contact-list.css'],
  standalone: false
})
export class ContactListComponent implements OnInit {
  @Input() contacts: Contact[] = []; // 🔹 Add this line!

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    //I might need ts one day
  }

  onSelected(contact: Contact) {
    this.contactService.contactSelectedEvent.emit(contact);
  }
}
