// src/app/footer/footer-component.component.ts
import { Component } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../services/language.service'; 

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer-component.component.html',
  styleUrls: ['./footer-component.component.scss']
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
  currentLang: 'en' | 'de';

  constructor(
    private languageService: LanguageService,
    private viewportScroller: ViewportScroller
  ) {
    this.currentLang = this.languageService.getLanguage();
  }

scrollToTop(): void {
  document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
  document.body.scrollTo({ top: 0, behavior: 'smooth' });
}


}
