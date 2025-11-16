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
  private firebaseUrl = 'https://w09database-default-rtdb.firebaseio.com/documents.json';

  constructor(private http: HttpClient) {
    this.documents = [];
    this.maxDocumentId = 0;
    this.getDocuments();
  }

  getDocuments(): Document[] {
    this.http.get<Document[]>(this.firebaseUrl)
      .subscribe(
        (documents: Document[]) => {
          this.documents = documents || [];
          this.maxDocumentId = this.getMaxId();
          this.documents.sort((a,b) => (a.name || '').localeCompare(b.name || ''));
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

  // Add a new document. Assign a unique id and emit the updated list.
  addDocument(newDocument: Document) {
    if (!newDocument) return;

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    // Ensure URL is absolute (add http:// if missing) so anchor opens external sites
    if (newDocument.url && !/^https?:\/\//i.test(newDocument.url)) {
      newDocument.url = 'http://' + newDocument.url;
    }
    this.documents.push(newDocument);
    this.storeDocuments();
  }

  // Update an existing document: locate original and replace with newDocument
  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) return;

    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) return;

    newDocument.id = originalDocument.id;
    if (newDocument.url && !/^https?:\/\//i.test(newDocument.url)) {
      newDocument.url = 'http://' + newDocument.url;
    }
    this.documents[pos] = newDocument;
    this.storeDocuments();
  }

  // Delete a document (accepts a Document object)
  deleteDocument(document: Document) {
    if (!document) return;

    const pos = this.documents.indexOf(document);
    if (pos < 0) return;

    this.documents.splice(pos, 1);
    this.storeDocuments();
  }

  storeDocuments(): void {
    const body = JSON.stringify(this.documents);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.put(this.firebaseUrl, body, { headers })
      .subscribe(() => {
        this.documentListChangedEvent.next(this.documents.slice());
      }, (error) => {
        console.error('Error storing documents to server:', error);
      });
  }
}