import { Component } from '@angular/core';
import { Contact } from './contact.model';

@Component({
  selector: 'cms-contacts',
  standalone: false,
  templateUrl: './contacts.html',
  styleUrls: ['./contacts.css']
})
export class Contacts {
   contacts: Contact[] = [
    new Contact(
      '1',
      'R. Kent Jackson',
      'jacksonk@byui.edu',
      '208-496-3771',
      'assets/jacksonk.jpg',
      null
    ),
    new Contact(
      '2',
      'Rex Barzee',
      'barzeer@byui.edu',
      '208-496-3768',
      'assets/barzeer.jpg',
      null
    )
  ];

  onNewContact() {
    // Dynamic creation logic here
    console.log('New Contact button clicked!');
  }
}
