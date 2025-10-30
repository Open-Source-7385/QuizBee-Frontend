import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarContentComponent } from '../sidebar-content/sidebar-content';
import {UserStatsHeader} from '../user-stats-header/user-stats-header';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, SidebarContentComponent, UserStatsHeader],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {

}
