import { Component, Input } from '@angular/core';
import { Document } from '../documents.model';


@Component({
  selector: 'cms-document-item',
  // this is the HTML tag you'll use
  templateUrl: './document-item.html',
  standalone: false, 
  styleUrls: ['./document-item.css']
})
export class DocumentItemComponent {   // must have Component in the class name
  @Input() document!: Document;
  @Input() isSelected: boolean = false;
}
