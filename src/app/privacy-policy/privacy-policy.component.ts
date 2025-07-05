import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../services/language.service';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponent implements OnInit, OnDestroy {
  currentLang: 'en' | 'de' = 'en';
  private langSub: Subscription;

  constructor(private languageService: LanguageService) {
    this.currentLang = this.languageService.getLanguage();
    this.langSub = this.languageService.lang$.subscribe((lang) => {
      this.currentLang = lang;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  ngOnDestroy(): void {
    this.langSub.unsubscribe();
  }
}
