import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { Document } from './documents.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documentSelectedEvent = new EventEmitter<Document>();
  // Subject that emits when the documents list changes
  documentListChangedEvent = new Subject<Document[]>();
  private documents: Document[] = [];
  maxDocumentId: number = 0;
  private nodeServerUrl = 'http://localhost:3000/documents';

  constructor(private http: HttpClient) {
    this.documents = [];
    this.maxDocumentId = 0;
    this.getDocuments();
  }

  getDocuments(): Document[] {
    this.http.get<{ message: string, documents: Document[] }>(this.nodeServerUrl)
      .subscribe(
        (response) => {
          this.documents = response.documents || [];
          this.documentListChangedEvent.next(this.documents.slice());
        },
        (error: any) => {
          console.error('Error fetching documents from server:', error);
        }
      );
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

  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }

    // make sure id of the new Document is empty
    newDocument.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // Ensure URL is absolute (add http:// if missing)
    if (newDocument.url && !/^https?:\/\//i.test(newDocument.url)) {
      newDocument.url = 'http://' + newDocument.url;
    }

    // add to database
    this.http.post<{ message: string, document: Document }>(this.nodeServerUrl,
      newDocument,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents
          this.documents.push(responseData.document);
          this.sortAndSend();
        }
      );
  }

  // Update an existing document: locate original and replace with newDocument
  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === originalDocument.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Document to the id of the old Document
    newDocument.id = originalDocument.id;

    // Ensure URL is absolute (add http:// if missing)
    if (newDocument.url && !/^https?:\/\//i.test(newDocument.url)) {
      newDocument.url = 'http://' + newDocument.url;
    }

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.http.put(this.nodeServerUrl + '/' + originalDocument.id,
      newDocument, { headers: headers })
      .subscribe(
        (response: any) => {
          this.documents[pos] = newDocument;
          this.sortAndSend();
        }
      );
  }

  // Delete a document (accepts a Document object)
  deleteDocument(document: Document) {

    if (!document) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === document.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http.delete(this.nodeServerUrl + '/' + document.id)
      .subscribe(
        (response: any) => {
          this.documents.splice(pos, 1);
          this.sortAndSend();
        }
      );
  }

  private sortAndSend() {
    this.documents.sort((a,b) => (a.name || '').localeCompare(b.name || ''));
    this.documentListChangedEvent.next(this.documents.slice());
  }
}