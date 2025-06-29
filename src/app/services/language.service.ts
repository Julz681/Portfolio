import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private lang: 'en' | 'de' = this.loadLanguage();

  setLanguage(lang: 'en' | 'de') {
    this.lang = lang;
    localStorage.setItem('lang', lang);
  }

  getLanguage(): 'en' | 'de' {
    return this.lang;
  }

  private loadLanguage(): 'en' | 'de' {
    const stored = localStorage.getItem('lang');
    return stored === 'de' || stored === 'en' ? stored : 'en';
  }
}
