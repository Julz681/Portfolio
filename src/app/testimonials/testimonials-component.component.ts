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
      text: 'Lukas has proven to be a reliable group partner. His technical skills and proactive approach were crucial to the success of our project.',
      author: 'H.Janisch',
      role: 'Team Partner',
    },
    {
      text: 'Our project benefited enormously from Simon efficient way of working.',
      author: 'T.Schulz',
      role: 'Frontend Developer',
    },
    {
      text: "I had the good fortune of working with Lukas in a group project at the Developer Akademie that involved a lot of effort. He's super knowledgeable, easy to work with, and I'd happily work with him again given the chance.",
      author: 'A. Fischer',
      role: 'Team Partner',
    },
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
