import { Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: Contact[] = [];

  constructor() {
    // Load initial mock contacts
    this.contacts = MOCKCONTACTS;
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
    this.contacts.push(contact);
  }

  // Update an existing contact
  updateContact(id: string, updatedContact: Contact): void {
    const index = this.contacts.findIndex(c => c.id === id);
    if (index > -1) {
      this.contacts[index] = updatedContact;
    }
  }

  // Delete a contact
  deleteContact(id: string): void {
    this.contacts = this.contacts.filter(c => c.id !== id);
  }
}
