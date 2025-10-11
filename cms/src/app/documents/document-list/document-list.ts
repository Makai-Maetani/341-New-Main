import { Component, EventEmitter, Output } from '@angular/core';
import { Document } from '../documents.model';

@Component({
  selector: 'cms-document-list',
  standalone: false,
  templateUrl: './document-list.html',
  styleUrls: ['./document-list.css']
})
export class DocumentListComponent {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    new Document(1, 'Resume', 'My current resume', 'https://example.com/resume.pdf'),
    new Document(2, 'Project Report', 'Final project report', 'https://example.com/project.pdf'),
    new Document(3, 'Invoice', 'Invoice for services', 'https://example.com/invoice.pdf'),
    new Document(4, 'Budget Sheet', '2025 budget spreadsheet', 'https://example.com/budget.pdf')
  ];

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
