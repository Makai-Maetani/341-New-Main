import { Component, OnInit } from '@angular/core';
import { Contact } from './contact.model';
import { ContactService } from './contact.service';

@Component({
  selector: 'cms-contacts',
  templateUrl: './contacts.html',
  styleUrls: ['./contacts.css'],
  standalone: false
})
export class Contacts implements OnInit {
  selectedContact!: Contact;
  showNewContactForm = false;
  isEditing = false;
  editingContactId: string | null = null;
  editForm: { name: string; email: string; phone: string; imageUrl: string } | null = null;

  contacts: Contact[] = [];

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    // Load initial contacts from the service
    this.contacts = this.contactService.getContacts();
    console.log('Loaded contacts:', this.contacts);
    // Subscribe to selection events emitted by the ContactService
    this.contactService.contactSelectedEvent.subscribe((contact: Contact) => {
      this.selectedContact = contact;
    });
  }

  toggleNewContactForm() {
    this.showNewContactForm = !this.showNewContactForm;
    if (!this.showNewContactForm) {
      this.isEditing = false;
      this.editingContactId = null;
      this.editForm = null;
    }
  }

  onAddNewContact(form: any) {
    if (!form.valid) return;

    if (this.isEditing && this.editingContactId) {
      // Update existing contact
      const updatedContact = new Contact(
        this.editingContactId,
        form.value.name,
        form.value.email,
        form.value.phone,
        form.value.imageUrl,
        null
      );

      this.contactService.updateContact(this.editingContactId, updatedContact);
      const index = this.contacts.findIndex(c => c.id === this.editingContactId);
      if (index > -1) this.contacts[index] = updatedContact;

      this.isEditing = false;
      this.editingContactId = null;
    } else {
      // Add new contact
      const newContact = new Contact(
        (Math.random() * 10000).toFixed(0),
        form.value.name,
        form.value.email,
        form.value.phone,
        form.value.imageUrl,
        null
      );

      this.contactService.addContact(newContact);
      this.contacts.push(newContact);
    }

    this.showNewContactForm = false;
    form.resetForm();
    this.editForm = null;
  }

  onEditContact(contact: Contact) {
    this.showNewContactForm = true;
    this.isEditing = true;
    this.editingContactId = contact.id;

    // Pre-fill form
    this.editForm = {
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      imageUrl: contact.imageUrl
    };
  }

 onDeleteContact(contact: Contact) {
  console.log('🗑️ Delete event received for:', contact.name);
  this.contactService.deleteContact(contact.id);
  this.contacts = this.contactService.getContacts();
  this.selectedContact = null!;
}

}
