import { Component, Input } from '@angular/core';
import { Document } from '../documents.model';

@Component({
  selector: 'cms-document-detail',
  standalone: false,
  templateUrl: './document-detail.html',
  styleUrls: ['./document-detail.css']
})
export class DocumentDetailComponent {
  @Input() document!: Document;
}
