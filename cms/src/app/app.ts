import { Component, signal } from '@angular/core';
import { Contacts } from './contacts/contacts';
import { Documents } from './documents/documents';
import { MessageListComponent } from './messages/message-list/message-list';

@Component({
  selector: 'cms-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: false
})
export class AppComponent {
  protected readonly title = signal('cms');

  // Track which feature is selected
  selectedFeature: string = 'contacts'; // default view

  // Method called when HeaderComponent emits the selected feature
  switchView(feature: string) {
    this.selectedFeature = feature;
  }
}
