import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Layout } from './presentation/components/layout/layout';
import { SidebarContentComponent } from './presentation/components/sidebar-content/sidebar-content';
import { FooterContent } from './presentation/components/footer-content/footer-content';
import { LanguageSwitcher } from './presentation/components/language-switcher/language-switcher';

@NgModule({
  imports: [CommonModule, RouterModule, Layout, SidebarContentComponent, FooterContent, LanguageSwitcher],
  exports: [Layout, SidebarContentComponent, FooterContent, LanguageSwitcher, CommonModule, RouterModule]
})
export class SharedModule {}
