import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonials-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials-component.component.html',
  styleUrls: ['./testimonials-component.component.scss'],
})
export class TestimonialsComponent {
  testimonials = [
    {
      text: 'Judith has proven to be a reliable group partner. His technical skills and proactive approach were crucial to the success of our project.',
      author: 'H.Janisch',
      role: 'Team Partner',
    },
    {
      text: 'I had the good fortune of working with Judith on a project at the Developer Akademie. He always stayed calm, cool and made sure the team was set up for success.',
      author: 'A.Meyer',
      role: 'Full Stack Developer',
    },
    {
      text: 'Tremendous collaboration and communication skills. Judith made our frontend shine with precision.',
      author: 'T.Schulz',
      role: 'Frontend Developer',
    },
  ];

  current = 0;

  prev() {
    this.current =
      (this.current - 1 + this.testimonials.length) % this.testimonials.length;
  }

  next() {
    this.current = (this.current + 1) % this.testimonials.length;
  }

  goTo(index: number) {
    this.current = index;
  }

  getPosition(index: number): string {
    if (index === this.current) return 'active';
    if (
      index ===
      (this.current - 1 + this.testimonials.length) % this.testimonials.length
    )
      return 'left';
    if (index === (this.current + 1) % this.testimonials.length) return 'right';
    return '';
  }
}
