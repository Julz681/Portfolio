import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-component.component.html',
  styleUrls: ['./hero-component.component.scss']
})
export class HeroComponent {
  @Input() currentLang: 'en' | 'de' = 'en';
}
