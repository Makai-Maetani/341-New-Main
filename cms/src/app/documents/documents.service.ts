import { Injectable, EventEmitter } from '@angular/core';
import { Document } from './documents.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documentSelectedEvent = new EventEmitter<Document>();
  documentChangedEvent = new EventEmitter<Document[]>();
  private documents: Document[] = [];

  constructor() {
    this.documents = MOCKDOCUMENTS;
  }

  getDocuments(): Document[] {
    return this.documents.slice();
  }

  getDocument(id: string): Document | null {
    return this.documents.find(d => d.id === id) || null;
  }

  addDocument(doc: Document): void {
    if (!doc.id) {
      doc.id = Date.now().toString();
    }
    this.documents.push(doc);
    this.documentChangedEvent.emit(this.getDocuments());
  }

  updateDocument(updated: Document): void {
    const index = this.documents.findIndex(d => d.id === updated.id);
    if (index > -1) {
      this.documents[index] = updated;
      this.documentChangedEvent.emit(this.getDocuments());
    }
  }

  deleteDocument(id: string): void {
    const index = this.documents.findIndex(d => d.id === id);
    if (index > -1) {
      this.documents.splice(index, 1);
      this.documentChangedEvent.emit(this.getDocuments());
    }
  }
}