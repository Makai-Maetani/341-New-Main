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
  private nodeServerUrl = 'http://localhost:3000/contacts';

  constructor(private http: HttpClient) {
    this.contacts = [];
    this.maxContactId = 0;
    this.getContacts();
  }

  // Get all contacts
  getContacts(): Contact[] {
    this.http.get<{ message: string, contacts: Contact[] }>(this.nodeServerUrl)
      .subscribe(
        (response) => {
          this.contacts = response.contacts || [];
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        (error: any) => {
          console.error('Error fetching contacts from server:', error);
        }
      );
    return this.contacts.slice();
  }

  // 🔹 Get a single contact by ID
  getContact(id: string): Contact | null {
    return this.contacts.find(contact => contact.id === id) || null;
  }

  // Add a new contact
  addContact(contact: Contact): void {
    if (!contact) {
      return;
    }

    contact.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.post<{ message: string, contact: Contact }>(this.nodeServerUrl,
      contact,
      { headers: headers })
      .subscribe(
        (responseData) => {
          this.contacts.push(responseData.contact);
          this.sortAndSend();
        }
      );
  }

  // Update an existing contact
  updateContact(originalOrId: any, newContact?: Contact): void {
    if (!originalOrId) {
      return;
    }

    // If called with an id string and a Contact
    if (typeof originalOrId === 'string' && newContact) {
      const index = this.contacts.findIndex(c => c.id === originalOrId);
      if (index > -1) {
        newContact.id = originalOrId;
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        this.http.put(this.nodeServerUrl + '/' + originalOrId, newContact, { headers: headers })
          .subscribe(
            (response: any) => {
              this.contacts[index] = newContact;
              this.sortAndSend();
            }
          );
      }
      return;
    }

    // If called with (originalContact, newContact)
    const originalContact: Contact = originalOrId as Contact;
    if (!originalContact || !newContact) {
      return;
    }
    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }
    newContact.id = originalContact.id;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.put(this.nodeServerUrl + '/' + originalContact.id, newContact, { headers: headers })
      .subscribe(
        (response: any) => {
          this.contacts[pos] = newContact;
          this.sortAndSend();
        }
      );
  }

  // Delete a contact
  deleteContact(idOrContact: any): void {
    if (!idOrContact) {
      return;
    }

    if (typeof idOrContact === 'string') {
      const pos = this.contacts.findIndex(c => c.id === idOrContact);
      if (pos > -1) {
        this.http.delete(this.nodeServerUrl + '/' + idOrContact)
          .subscribe(
            (response: any) => {
              this.contacts.splice(pos, 1);
              this.sortAndSend();
            }
          );
      }
      return;
    }

    // it's a contact object
    const pos = this.contacts.indexOf(idOrContact as Contact);
    if (pos < 0) {
      return;
    }
    this.http.delete(this.nodeServerUrl + '/' + (idOrContact as Contact).id)
      .subscribe(
        (response: any) => {
          this.contacts.splice(pos, 1);
          this.sortAndSend();
        }
      );
  }

  private sortAndSend() {
    this.contacts.sort((a,b) => (a.name || '').localeCompare(b.name || ''));
    this.contactListChangedEvent.next(this.contacts.slice());
  }
}
