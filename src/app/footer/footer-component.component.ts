import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegalNoticeComponent } from '../legal-notice/legal-notice.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, LegalNoticeComponent],
  templateUrl: './footer-component.component.html',
  styleUrls: ['./footer-component.component.scss']
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  showLegalNotice = false;

  ngOnInit(): void {
    document.addEventListener('closed', () => {
      this.showLegalNotice = false;
    });
  }

  toggleLegalNotice(): void {
    this.showLegalNotice = true;
  }
}
