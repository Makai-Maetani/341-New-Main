import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

// Root component
import { AppComponent } from './app';

// Header
import { HeaderComponent } from './header';

// Contacts
import { Contacts } from './contacts/contacts';
import { ContactListComponent } from './contacts/contact-list/contact-list';
import { ContactItemComponent } from './contacts/contact-item/contact-item';
import { ContactDetailComponent } from './contacts/contact-detail/contact-detail';

// Documents
import { Documents } from './documents/documents';
import { DocumentListComponent } from './documents/document-list/document-list';
import { DocumentItemComponent } from './documents/document-item/document-item';
import { DocumentDetailComponent } from './documents/document-detail/document-detail';
import { Messages } from './messages/messages';
import { MessageEditComponent } from './messages/message-edit/message-edit';
import { MessageItemComponent } from './messages/message-item/message-item';
import { MessageListComponent } from './messages/message-list/message-list';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    // Contacts
    Contacts,
    ContactListComponent,
    ContactItemComponent,
    ContactDetailComponent,
    // Documents
    Documents,
    DocumentListComponent,
    DocumentItemComponent,
    DocumentDetailComponent,
    // Messages
    Messages,
    MessageEditComponent,
    MessageItemComponent,
    MessageListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
