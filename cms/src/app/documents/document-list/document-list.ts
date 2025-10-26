import { Component, OnInit } from '@angular/core';
import { Document } from '../documents.model';
import { DocumentService } from '../documents.service';

@Component({
  selector: 'cms-document-list',
  standalone: false,
  templateUrl: './document-list.html',
  styleUrls: ['./document-list.css']
})
export class DocumentListComponent implements OnInit {
  documents: Document[] = [];
  selectedDocumentId: string | null = null;
  showAddMessage: boolean = false;

  constructor(private documentService: DocumentService) {}

  ngOnInit() {
    this.documents = this.documentService.getDocuments();
    this.documentService.documentChangedEvent.subscribe((docs: Document[]) => {
      this.documents = docs;
    });
  }

  onSelectedDocument(document: Document) {
    this.documentService.documentSelectedEvent.emit(document);
    this.selectedDocumentId = document.id;
  }

  onNewDocument() {
  this.showAddMessage = true; 

     
      
    }

}
