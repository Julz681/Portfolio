import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../services/language.service';


@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent {
  @Output() closed = new EventEmitter<void>();
  currentLang: 'en' | 'de';

  constructor(private languageService: LanguageService) {
    this.currentLang = this.languageService.getLanguage();
  }

  closeOverlay() {
    this.closed.emit();
  }
}
