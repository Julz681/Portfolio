import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skill-set-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skill-set-component.component.html',
  styleUrl: './skill-set-component.component.scss',
})
export class SkillSetComponent {
  @Input() currentLang: 'en' | 'de' = 'en';

  isClicked = false;

  onLetsTalk() {
    this.isClicked = true;
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  }

  scrollToContact() {
    const target = document.getElementById('contact');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
