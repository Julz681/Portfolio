// src/app/footer/footer-component.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  currentLang: 'en' | 'de'; // <-- hinzufügen

  constructor(private languageService: LanguageService) {
    this.currentLang = this.languageService.getLanguage();
  }
}
