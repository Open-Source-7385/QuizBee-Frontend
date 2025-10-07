import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Layout} from './shared/presentation/components/layout/layout';
import {QuizzList} from './quizzies/presentation/views/quizz-list/quizz-list';
import {routes} from './app.routes';
import {SidebarContentComponent} from './shared/presentation/components/sidebar-content/sidebar-content';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Layout],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('quizbee-frontend');
}
