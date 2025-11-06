import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OnChanges, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.html',
  styleUrls: ['./contact-edit.css'],
  standalone: false
})
export class ContactEditComponent implements OnInit, OnChanges {
  @Input() contact: Contact | null = null;
  // internal model used for template binding (always non-null)
  contactModel: Contact = new Contact('', '', '', '', '', null);
  originalContact: Contact | null = null;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: string | null = null;

  @Output() close = new EventEmitter<void>();

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      if (!id) {
        // if contact was passed in as @Input for editing, use it
        if (this.contact) {
          this.editMode = true;
          this.originalContact = this.contact;
          this.contactModel = JSON.parse(JSON.stringify(this.contact));
          this.groupContacts = this.contact.group ? JSON.parse(JSON.stringify(this.contact.group)) : [];
        } else {
          this.editMode = false;
          // initialize empty contactModel for add mode so [(ngModel)] binds work
          this.contactModel = new Contact('', '', '', '', '', null);
          this.groupContacts = [];
        }
        return;
      }
      this.id = id;
      const original = this.contactService.getContact(id);
      if (!original) return;
      this.editMode = true;
      this.originalContact = original;
      this.contactModel = JSON.parse(JSON.stringify(original));
      this.groupContacts = original.group ? JSON.parse(JSON.stringify(original.group)) : [];
    });
  }

  // implement OnChanges to react to @Input changes
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contact']) {
      if (this.contact) {
        this.editMode = true;
        this.originalContact = this.contact;
        this.contactModel = JSON.parse(JSON.stringify(this.contact));
        this.groupContacts = this.contact.group ? JSON.parse(JSON.stringify(this.contact.group)) : [];
      } else {
        this.editMode = false;
        this.contactModel = new Contact('', '', '', '', '', null);
        this.groupContacts = [];
      }
    }
  }
  onSubmit(form: NgForm) {
    // Use the internal contactModel so bindings and validation are consistent
    if (!this.contactModel) return;
    const newContact = new Contact(
      '',
      this.contactModel.name,
      this.contactModel.email,
      this.contactModel.phone,
      this.contactModel.imageUrl,
      this.groupContacts.length ? this.groupContacts : null
    );

    if (this.editMode && this.originalContact) {
      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      this.contactService.addContact(newContact);
    }

    this.close.emit();
    try {
      this.router.navigate(['/contacts']);
    } catch (e) {}
  }

  onCancel() {
    this.close.emit();
    try {
      this.router.navigate(['/contacts']);
    } catch (e) {}
  }

  isInvalidContact(newContact: Contact | null) {
    if (!newContact) return true;
    if (this.contactModel && newContact.id === this.contactModel.id) return true;
    for (let i = 0; i < this.groupContacts.length; i++) {
      if (newContact.id === this.groupContacts[i].id) return true;
    }
    return false;
  }

  addToGroup(selectedContact: Contact) {
    if (this.isInvalidContact(selectedContact)) return;
    this.groupContacts.push(selectedContact);
  }

  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length) return;
    this.groupContacts.splice(index, 1);
  }
}
