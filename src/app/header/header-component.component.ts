import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-component.component.html',
  styleUrls: ['./header-component.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() languageChange = new EventEmitter<'en' | 'de'>();

  currentLang: 'en' | 'de' = 'en';
  isMobile = false;
  menuOpen = false;
  pendingFragment: string | null = null;

  constructor(
    private languageService: LanguageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentLang = this.languageService.getLanguage();
    this.languageChange.emit(this.currentLang);
    this.checkIfMobile();

    // Fragment scroll nach Navigation
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.pendingFragment) {
          const el = document.getElementById(this.pendingFragment);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
          this.pendingFragment = null;
        }
      });
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

  scrollToFragment(fragment: string) {
    this.pendingFragment = fragment;
    this.router.navigate(['/'], { fragment });
  }

  onMobileLinkClick(fragment: string) {
    this.scrollToFragment(fragment);
    this.closeMenu();
  }
}
