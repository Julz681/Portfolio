import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-component.component.html',
  styleUrls: ['./header-component.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() languageChange = new EventEmitter<'en' | 'de'>();

  currentLang: 'en' | 'de' = 'en';

  ngOnInit(): void {
    const storedLang = localStorage.getItem('lang') as 'en' | 'de' | null;
    if (storedLang === 'en' || storedLang === 'de') {
      this.currentLang = storedLang;
      this.languageChange.emit(this.currentLang);
    }
  }

  switchLanguage(lang: 'en' | 'de') {
    this.currentLang = lang;
    localStorage.setItem('lang', lang);
    this.languageChange.emit(lang);
  }
}
