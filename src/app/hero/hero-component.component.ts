import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-hero-component',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './hero-component.component.html',
  styleUrls: ['./hero-component.component.scss']
})
export class HeroComponent {
  @Input() currentLang: 'en' | 'de' = 'en';
}
