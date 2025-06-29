import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonials-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials-component.component.html',
  styleUrls: ['./testimonials-component.component.scss'],
})
export class TestimonialsComponent implements OnInit, OnDestroy {
  @Input() currentLang: 'en' | 'de' = 'en';

  testimonials = [
    {
      text_en: 'Judith was a dependable and thoughtful teammate. Her technical understanding and proactive mindset made a real difference in our collaboration.',
      text_de: 'Judith war eine verlässliche und gewissenhafte Teamkollegin. Ihr technisches Verständnis und ihre proaktive Denkweise haben unsere Zusammenarbeit bereichert.',
      author: 'L. Bauer',
      role: 'Project Collaborator',
    },
    {
      text_en: 'Working with Judith was a pleasure — she delivered high-quality code, stayed focused, and kept communication clear throughout the project.',
      text_de: 'Die Zusammenarbeit mit Judith war ein Vergnügen – sie lieferte hochwertigen Code, blieb fokussiert und sorgte für eine klare Kommunikation im Projektverlauf.',
      author: 'M. Weber',
      role: 'Frontend Engineer',
    },
    {
      text_en: 'Judith brought structure and calm to a fast-paced group project. She’s reliable, solution-oriented, and great at balancing detail with progress.',
      text_de: 'Judith brachte Struktur und Ruhe in ein dynamisches Gruppenprojekt. Sie ist zuverlässig, lösungsorientiert und schafft es, Detailgenauigkeit mit Fortschritt zu verbinden.',
      author: 'S. König',
      role: 'Fullstack Developer',
    }
  ];

  currentIndex = 0;
  intervalId: any;

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => this.nextTestimonial(), 7000);
  }

  nextTestimonial(): void {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  }

  prevTestimonial(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
  }

  goTo(index: number): void {
    this.currentIndex = index;
  }
}
