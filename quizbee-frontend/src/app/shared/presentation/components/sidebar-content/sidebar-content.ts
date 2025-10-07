import { Component } from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';
interface SidebarItem {
  label: string;
  icon: string;
  route: string;
}
@Component({
  selector: 'app-sidebar-content',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar-content.html',
  styleUrl: './sidebar-content.css'
})
export class SidebarContentComponent {
  menuItems: SidebarItem[] = [
    { label: 'Perfil', icon: '👤', route: '/perfil' },
    { label: 'Inicio', icon: '🏠', route: '/home' },
    { label: 'Crear', icon: '➕', route: '/crear' },
    { label: 'Creaciones', icon: '📂', route: '/creaciones' },
    { label: 'Quizz', icon: '🚀', route: '/quizz' },
    { label: 'Ranking', icon: '📊', route: '/ranking' },
    { label: 'Historial', icon: '🕑', route: '/historial' },
    { label: 'Speaking Room', icon: '🎤', route: '/speaking-room' }
  ];
}
