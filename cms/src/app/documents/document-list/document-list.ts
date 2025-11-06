import { Component, OnInit, OnDestroy } from '@angular/core';
import { Document } from '../documents.model';
import { DocumentService } from '../documents.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-document-list',
  standalone: false,
  templateUrl: './document-list.html',
  styleUrls: ['./document-list.css']
})
export class DocumentListComponent implements OnInit, OnDestroy {
  documents: Document[] = [];
  selectedDocumentId: string | null = null;
  showAddMessage: boolean = false;
  subscription!: Subscription;

  constructor(private documentService: DocumentService) {}

  ngOnInit() {
    // initialize local copy and subscribe to service's Subject
    this.documents = this.documentService.getDocuments();
    this.subscription = this.documentService.documentListChangedEvent
      .subscribe((docs: Document[]) => {
        this.documents = docs;
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  onSelectedDocument(document: Document) {
    this.documentService.documentSelectedEvent.emit(document);
    this.selectedDocumentId = document.id;
  }

  onNewDocument() {
  this.showAddMessage = true; 

     
      
    }
  onCloseEdit() {
    this.showAddMessage = false;
  }

}
