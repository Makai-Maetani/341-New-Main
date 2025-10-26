import { Component, signal } from '@angular/core';

@Component({
  selector: 'cms-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: false
})
export class AppComponent {
  protected readonly title = signal('cms');

}
