import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  // Event emitter for cross-component communication when a contact is selected
  contactSelectedEvent = new EventEmitter<Contact>();
  // Subject to emit when the contacts list changes
  contactListChangedEvent = new Subject<Contact[]>();
  private contacts: Contact[] = [];
  maxContactId: number = 0;

  constructor() {
    // Load initial mock contacts
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
    // emit initial list
    this.contactListChangedEvent.next(this.getContacts());
  }

  // Get all contacts
  getContacts(): Contact[] {
    return this.contacts.slice(); // Return a copy
  }

  // 🔹 Get a single contact by ID
  getContact(id: string): Contact | null {
    return this.contacts.find(contact => contact.id === id) || null;
  }

  // Add a new contact
  addContact(contact: Contact): void {
    if (!contact) return;

    // If id is missing, give a unique numeric id
    this.maxContactId++;
    contact.id = this.maxContactId.toString();
    this.contacts.push(contact);
    this.contactListChangedEvent.next(this.getContacts());
  }

  // Update an existing contact
  // Support both (id, updatedContact) and (originalContact, newContact) styles
  updateContact(originalOrId: any, newContact?: Contact): void {
    if (!originalOrId) return;

    // If called with an id string and a Contact
    if (typeof originalOrId === 'string' && newContact) {
      const index = this.contacts.findIndex(c => c.id === originalOrId);
      if (index > -1) {
        this.contacts[index] = newContact;
        this.contactListChangedEvent.next(this.getContacts());
      }
      return;
    }

    // If called with (originalContact, newContact)
    const originalContact: Contact = originalOrId as Contact;
    if (!originalContact || !newContact) return;
    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0) return;
    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    this.contactListChangedEvent.next(this.getContacts());
  }

  // Delete a contact
  // Accept either an id string or a Contact object
  deleteContact(idOrContact: any): void {
    if (!idOrContact) return;

    if (typeof idOrContact === 'string') {
      this.contacts = this.contacts.filter(c => c.id !== idOrContact);
      this.contactListChangedEvent.next(this.getContacts());
      return;
    }

    // it's a contact object
    const pos = this.contacts.indexOf(idOrContact as Contact);
    if (pos < 0) return;
    this.contacts.splice(pos, 1);
    this.contactListChangedEvent.next(this.getContacts());
  }

  // Returns the maximum numeric id used among contacts
  getMaxId(): number {
    let maxId = 0;
    for (const c of this.contacts) {
      const currentId = parseInt(c.id as any, 10);
      if (!isNaN(currentId) && currentId > maxId) maxId = currentId;
    }
    return maxId;
  }
}
