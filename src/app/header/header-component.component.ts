import { Component, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
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
  isMobile = false;
  menuOpen = false;

  ngOnInit(): void {
    const storedLang = localStorage.getItem('lang') as 'en' | 'de' | null;
    if (storedLang === 'en' || storedLang === 'de') {
      this.currentLang = storedLang;
      this.languageChange.emit(this.currentLang);
    }
    this.checkIfMobile();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkIfMobile();
  }

  checkIfMobile() {
    this.isMobile = window.innerWidth < 720;
    if (!this.isMobile) {
      this.menuOpen = false;
    }
  }

  switchLanguage(lang: 'en' | 'de') {
    this.currentLang = lang;
    localStorage.setItem('lang', lang);
    this.languageChange.emit(lang);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }
}
