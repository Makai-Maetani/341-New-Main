import { Component } from '@angular/core';

@Component({
  selector: 'cms-header',
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
  standalone: false
})
export class HeaderComponent {
  // Navigation is now handled by the Router via routerLink in the template.
}
