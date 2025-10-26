import { Component, Input } from '@angular/core';
import { Document } from '../documents.model';
import { DocumentService } from '../documents.service';

@Component({
  selector: 'cms-document-detail',
  templateUrl: './document-detail.html',
  styleUrls: ['./document-detail.css'],
  standalone: false
})
export class DocumentDetailComponent {
  @Input() document!: Document;
  showEditMessage = false; // new flag

  constructor(private documentService: DocumentService) {}

  onDelete() {
    if (!this.document) return;
    this.documentService.deleteDocument(this.document.id);
  }

  onEdit() {
    this.showEditMessage = true;
  }
}
