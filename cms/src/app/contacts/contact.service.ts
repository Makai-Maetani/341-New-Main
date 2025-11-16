import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  // Replace with your Realtime DB URL (contacts endpoint)
  private firebaseUrl = 'https://w09database-default-rtdb.firebaseio.com/contacts.json';

  constructor(private http: HttpClient) {
    // initialize empty and fetch from server
    this.contacts = [];
    this.maxContactId = 0;
    this.getContacts();
  }

  // Get all contacts
  getContacts(): Contact[] {
    // Issue an HTTP GET to fetch contacts from Firebase
    this.http.get<Contact[]>(this.firebaseUrl)
      .subscribe(
        (contacts: Contact[] ) => {
          this.contacts = contacts || [];
          this.maxContactId = this.getMaxId();
          this.contacts.sort((a,b) => (a.name || '').localeCompare(b.name || ''));
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        (error: any) => {
          console.error('Error fetching contacts from server:', error);
        }
      );
    return this.contacts.slice(); // synchronous copy (may be empty until server responds)
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
    this.storeContacts();
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
        this.storeContacts();
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
    this.storeContacts();
  }

  // Delete a contact
  // Accept either an id string or a Contact object
  deleteContact(idOrContact: any): void {
    if (!idOrContact) return;

    if (typeof idOrContact === 'string') {
      this.contacts = this.contacts.filter(c => c.id !== idOrContact);
      this.storeContacts();
      return;
    }

    // it's a contact object
    const pos = this.contacts.indexOf(idOrContact as Contact);
    if (pos < 0) return;
    this.contacts.splice(pos, 1);
    this.storeContacts();
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

  storeContacts(): void {
    const body = JSON.stringify(this.contacts);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.put(this.firebaseUrl, body, { headers })
      .subscribe(() => {
        this.contactListChangedEvent.next(this.contacts.slice());
      }, (error) => {
        console.error('Error storing contacts to server:', error);
      });
  }
}
