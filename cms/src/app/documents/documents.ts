import { Component, OnInit } from '@angular/core';
import { Document } from './documents.model';
import { DocumentService } from './documents.service';

@Component({
  selector: 'cms-documents',
  standalone: false,
  templateUrl: './documents.html',
  styleUrls: ['./documents.css']
})
export class Documents implements OnInit {
  selectedDocument!: Document | null;

  constructor(private documentService: DocumentService) {}

  ngOnInit() {
    this.documentService.documentSelectedEvent.subscribe((doc: Document) => {
      this.selectedDocument = doc;
    });
    this.documentService.documentListChangedEvent.subscribe(() => {
      // if the currently selected document was deleted, clear the selection
      if (this.selectedDocument) {
        const stillExists = this.documentService.getDocument(this.selectedDocument.id);
        if (!stillExists) {
          this.selectedDocument = null;
        }
      }
    });
  }
}
