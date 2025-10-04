import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarContentComponent } from '../sidebar-content/sidebar-content';

@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarContentComponent
  ],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class Layout {
}
