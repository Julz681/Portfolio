import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../services/language.service';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-legal-notice',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './legal-notice.component.html',
  styleUrls: ['./legal-notice.component.scss']
})
export class LegalNoticeComponent implements OnDestroy {
  currentLang: 'en' | 'de';
  private langSub: Subscription;

  constructor(private languageService: LanguageService) {
    this.currentLang = this.languageService.getLanguage();

    this.langSub = this.languageService.lang$.subscribe((lang) => {
      this.currentLang = lang;
    });
  }

  ngOnDestroy(): void {
    this.langSub.unsubscribe();
  }
}
