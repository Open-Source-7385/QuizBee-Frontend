import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarContentComponent } from '../sidebar-content/sidebar-content';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, SidebarContentComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {

}
