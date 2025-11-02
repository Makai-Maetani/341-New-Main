import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { Document } from './documents.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documentSelectedEvent = new EventEmitter<Document>();
  // Subject that emits when the documents list changes
  documentListChangedEvent = new Subject<Document[]>();
  private documents: Document[] = [];
  maxDocumentId: number = 0;

  constructor() {
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
    // Emit initial list so subscribers get the starting data
    this.documentListChangedEvent.next(this.getDocuments());
  }

  getDocuments(): Document[] {
    return this.documents.slice();
  }

  getDocument(id: string): Document | null {
    return this.documents.find(d => d.id === id) || null;
  }
  // Find the maximum numeric id currently used by any document
  getMaxId(): number {
    let maxId = 0;
    for (const doc of this.documents) {
      const currentId = parseInt(doc.id as any, 10);
      if (!isNaN(currentId) && currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  // Add a new document. Assign a unique id and emit the updated list.
  addDocument(newDocument: Document) {
    if (!newDocument) return;

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    const documentsListClone = this.getDocuments();
    this.documentListChangedEvent.next(documentsListClone);
  }

  // Update an existing document: locate original and replace with newDocument
  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) return;

    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) return;

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    const documentsListClone = this.getDocuments();
    this.documentListChangedEvent.next(documentsListClone);
  }

  // Delete a document (accepts a Document object)
  deleteDocument(document: Document) {
    if (!document) return;

    const pos = this.documents.indexOf(document);
    if (pos < 0) return;

    this.documents.splice(pos, 1);
    const documentsListClone = this.getDocuments();
    this.documentListChangedEvent.next(documentsListClone);
  }
}