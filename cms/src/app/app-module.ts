import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { AppComponent } from './app';
import { HeaderComponent } from './header';
import { Contacts } from './contacts/contacts';
import { ContactListComponent } from './contacts/contact-list/contact-list';
import { ContactDetailComponent } from './contacts/contact-detail/contact-detail';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    Contacts,
    ContactListComponent,  
    ContactDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}



