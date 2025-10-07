import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarContentComponent } from '../sidebar-content/sidebar-content';
import {QuizzList} from '../../../../quizzies/presentation/views/quizz-list/quizz-list';
import {QuizzPlay} from '../../../../quizzies/presentation/views/quizz-play/quizz-play';

@Component({
  selector: 'app-layout',
  imports: [
    CommonModule, QuizzList, SidebarContentComponent, RouterOutlet, QuizzPlay
  ],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class Layout {
}
