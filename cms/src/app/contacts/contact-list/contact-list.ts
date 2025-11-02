import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.html',
  styleUrls: ['./contact-list.css'],
  standalone: false
})
export class ContactListComponent implements OnInit, OnDestroy {
  // Component local contacts list (can also accept input initially)
  @Input() contacts: Contact[] = [];
  subscription!: Subscription;

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    // initialize local copy and subscribe for updates from the service
    this.contacts = this.contactService.getContacts();
    this.subscription = this.contactService.contactListChangedEvent
      .subscribe((contacts: Contact[]) => {
        this.contacts = contacts;
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  onSelected(contact: Contact) {
    this.contactService.contactSelectedEvent.emit(contact);
  }
}
