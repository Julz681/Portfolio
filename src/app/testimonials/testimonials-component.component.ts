import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonials-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials-component.component.html',
  styleUrls: ['./testimonials-component.component.scss'],
})
export class TestimonialsComponent implements OnInit, OnDestroy {
testimonials = [
  {
    text: 'Judith was a dependable and thoughtful teammate. Her technical understanding and proactive mindset made a real difference in our collaboration.',
    author: 'L. Bauer',
    role: 'Project Collaborator',
  },
  {
    text: 'Working with Judith was a pleasure — she delivered high-quality code, stayed focused, and kept communication clear throughout the project.',
    author: 'M. Weber',
    role: 'Frontend Engineer',
  },
  {
    text: 'Judith brought structure and calm to a fast-paced group project. She’s reliable, solution-oriented, and great at balancing detail with progress.',
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
      (this.currentIndex - 1 + this.testimonials.length) %
      this.testimonials.length;
  }

  goTo(index: number): void {
    this.currentIndex = index;
  }
}
