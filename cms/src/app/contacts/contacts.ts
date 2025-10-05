import { Component } from '@angular/core';
import { Contact } from './contact.model';

@Component({
  selector: 'cms-contacts',
  templateUrl: './contacts.html',
  styleUrls: ['./contacts.css'],
  standalone: false // explicitly non-standalone
})
export class Contacts {
  selectedContact!: Contact;
  showNewContactForm = false;
  isEditing = false;            // Track if we are editing
  editingContactId: string | null = null; // Store which contact is being edited

  // Form pre-fill object
  editForm: { name: string; email: string; phone: string; imageUrl: string } | null = null;

  contacts: Contact[] = [
    new Contact('1', 'R. Kent Jackson', 'jacksonk@byui.edu', '208-496-3771', 'assets/jacksonk.jpg', null),
    new Contact('2', 'Rex Barzee', 'barzeer@byui.edu', '208-496-3768', 'assets/barzeer.jpg', null)
  ];

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
      const index = this.contacts.findIndex(c => c.id === this.editingContactId);
      if (index > -1) {
        this.contacts[index] = new Contact(
          this.editingContactId,
          form.value.name,
          form.value.email,
          form.value.phone,
          form.value.imageUrl,
          null
        );
      }
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
    const index = this.contacts.indexOf(contact);
    if (index > -1) {
      this.contacts.splice(index, 1);
    }
  }
}
