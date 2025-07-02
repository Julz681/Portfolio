import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../services/language.service';


@Component({
  selector: 'app-legal-notice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './legal-notice.component.html',
  styleUrls: ['./legal-notice.component.scss']
})
export class LegalNoticeComponent {
  @Output() closed = new EventEmitter<void>();
  currentLang: 'en' | 'de';

  constructor(private languageService: LanguageService) {
    this.currentLang = this.languageService.getLanguage();
  }

  closeOverlay() {
    this.closed.emit();
  }
}
