import { Component, EventEmitter, Output } from '@angular/core';
import { Document } from '../documents.model';
import { MOCKDOCUMENTS } from '../MOCKDOCUMENTS';

@Component({
  selector: 'cms-document-list',
  standalone: false,
  templateUrl: './document-list.html',
  styleUrls: ['./document-list.css']
})
export class DocumentListComponent {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = MOCKDOCUMENTS;

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
