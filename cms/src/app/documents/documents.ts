import { Component } from '@angular/core';
import { Document } from './documents.model';

@Component({
  selector: 'cms-documents',
  standalone: false,
  templateUrl: './documents.html',
  styleUrls: ['./documents.css']
})
export class Documents {
  selectedDocument!: Document;

  onSelectedDocument(document: Document) {
    this.selectedDocument = document;
  }
}
