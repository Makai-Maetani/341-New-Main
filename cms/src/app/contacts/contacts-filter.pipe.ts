import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from './contact.model';

@Pipe({
  name: 'contactsFilter',
  standalone: true
})
export class ContactsFilterPipe implements PipeTransform {
  transform(contacts: Contact[], term: string): Contact[] {
    if (!contacts) return [];
    if (!term || term.trim().length === 0) {
      return contacts;
    }
    const lowerTerm = term.toLowerCase();
    const filtered = contacts.filter((contact: Contact) => {
      return !!contact.name && contact.name.toLowerCase().includes(lowerTerm);
    });
    if (filtered.length < 1) return contacts;
    return filtered;
  }
}
