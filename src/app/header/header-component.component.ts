import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../services/language.service'; 

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

  constructor(private languageService: LanguageService) {} 

  ngOnInit(): void {
    const storedLang = this.languageService.getLanguage(); 
    this.currentLang = storedLang;
    this.languageChange.emit(this.currentLang);
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
    this.languageService.setLanguage(lang); 
    this.languageChange.emit(lang); 
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }
}
