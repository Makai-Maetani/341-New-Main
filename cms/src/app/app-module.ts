//Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

// Root component
import { AppComponent } from './app';

// Header
import { HeaderComponent } from './header';

//Dropdown
import { DropdownDirective } from './dropdown.directive';

// Contacts
import { Contacts } from './contacts/contacts';
import { ContactListComponent } from './contacts/contact-list/contact-list';
import { ContactItemComponent } from './contacts/contact-item/contact-item';
import { ContactDetailComponent } from './contacts/contact-detail/contact-detail';
import { ContactEditComponent } from './contacts/contact-edit/contact-edit';
import { ContactsFilterPipe } from './contacts/contacts-filter.pipe';

// Documents
import { Documents } from './documents/documents';
import { DocumentListComponent } from './documents/document-list/document-list';
import { DocumentItemComponent } from './documents/document-item/document-item';
import { DocumentDetailComponent } from './documents/document-detail/document-detail';
import { DocumentEditComponent } from './documents/document-edit/document-edit';

// Messages
import { Messages } from './messages/messages';
import { MessageEditComponent } from './messages/message-edit/message-edit';
import { MessageItemComponent } from './messages/message-item/message-item';
import { MessageListComponent } from './messages/message-list/message-list';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DropdownDirective,
    // Contacts
    Contacts,
    ContactListComponent,
    ContactItemComponent,
  ContactDetailComponent,
  ContactEditComponent,
    // Documents
    Documents,
    DocumentListComponent,
    DocumentItemComponent,
    DocumentDetailComponent,
  DocumentEditComponent,
    // Messages
    Messages,
    MessageEditComponent,
    MessageItemComponent,
    MessageListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ContactsFilterPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
