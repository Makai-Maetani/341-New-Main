import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Document } from '../documents.model';
import { DocumentService } from '../documents.service';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.html',
  styleUrls: ['./document-edit.css'],
  standalone: false
})
export class DocumentEditComponent implements OnInit {
  @Input() documentInput: Document | null = null; // allow embedded edit via input
  originalDocument: Document | null = null;
  document: Document = new Document('', '', '', '', []);
  editMode: boolean = false;
  id: string | null = null;

  @Output() close = new EventEmitter<void>();

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // If used embedded and a document was passed as @Input, use it
    if (this.documentInput) {
      this.editMode = true;
      this.originalDocument = this.documentInput;
      this.document = JSON.parse(JSON.stringify(this.documentInput));
      return;
    }

    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      if (!id) {
        this.editMode = false;
        // initialize an empty document for the add form
        this.document = new Document('', '', '', '', []);
        return;
      }
      this.id = id;
      const original = this.documentService.getDocument(id);
      if (!original) return;
      this.editMode = true;
      this.originalDocument = original;
      // clone
      this.document = JSON.parse(JSON.stringify(original));
    });
  }

  onSubmit(form: NgForm) {
    if (!form || !form.value) return;
    const value = form.value;
    const newDocument = new Document(
      '',
      value.name,
      value.description,
      value.url,
      []
    );

    if (this.editMode && this.originalDocument) {
      this.documentService.updateDocument(this.originalDocument, newDocument);
    } else {
      this.documentService.addDocument(newDocument);
    }

    // if embedded, emit close so parent can hide the form; otherwise navigate
    this.close.emit();
    try {
      this.router.navigate(['/documents']);
    } catch (e) {
      // ignore navigation errors when embedded
    }
  }

  onCancel() {
    this.close.emit();
    try {
      this.router.navigate(['/documents']);
    } catch (e) {}
  }
}
