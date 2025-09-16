import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private langSubject = new BehaviorSubject<'en' | 'de'>(this.loadLanguage());

  lang$ = this.langSubject.asObservable(); 

  setLanguage(lang: 'en' | 'de') {
    localStorage.setItem('lang', lang);
    this.langSubject.next(lang); 
  }

  getLanguage(): 'en' | 'de' {
    return this.langSubject.getValue(); 
  }

  private loadLanguage(): 'en' | 'de' {
    const stored = localStorage.getItem('lang');
    return stored === 'de' || stored === 'en' ? stored : 'en';
  }
}
