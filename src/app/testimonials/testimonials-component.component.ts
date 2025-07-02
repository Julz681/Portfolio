import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewChild,
  ElementRef,
  HostListener,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonials-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials-component.component.html',
  styleUrls: ['./testimonials-component.component.scss'],
})
export class TestimonialsComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() currentLang: 'en' | 'de' = 'en';
  @ViewChild('carousel', { static: false }) carousel?: ElementRef<HTMLDivElement>;

  testimonials = [
    {
      text_en:
        'Judith was a dependable and thoughtful teammate. Her technical understanding and proactive mindset made a real difference in our collaboration.',
      text_de:
        'Judith war eine verlässliche und gewissenhafte Teamkollegin. Ihr technisches Verständnis und ihre proaktive Denkweise haben unsere Zusammenarbeit bereichert.',
      author: 'L. Bauer',
      role: 'Project Collaborator',
    },
    {
      text_en:
        'Working with Judith was a pleasure — she delivered high-quality code, stayed focused, and kept communication clear throughout the project.',
      text_de:
        'Die Zusammenarbeit mit Judith war ein Vergnügen – sie lieferte hochwertigen Code, blieb fokussiert und sorgte für eine klare Kommunikation im Projektverlauf.',
      author: 'M. Weber',
      role: 'Frontend Engineer',
    },
    {
      text_en:
        'Judith brought structure and calm to a fast-paced group project. She’s reliable, solution-oriented, and great at balancing detail with progress.',
      text_de:
        'Judith brachte Struktur und Ruhe in ein dynamisches Gruppenprojekt. Sie ist zuverlässig, lösungsorientiert und schafft es, Detailgenauigkeit mit Fortschritt zu verbinden.',
      author: 'S. König',
      role: 'Fullstack Developer',
    },
  ];

  currentIndex = 0;
  intervalId: ReturnType<typeof setInterval> | null = null;
  isMobile = false;

  ngOnInit(): void {
    this.updateDeviceMode();
  }

  ngAfterViewInit(): void {
    if (this.isMobile && this.carousel) {
      this.carousel.nativeElement.addEventListener('scroll', this.onScroll);
    }
  }

  ngOnDestroy(): void {
    this.clearAutoSlide();
    if (this.carousel && this.isMobile) {
      this.carousel.nativeElement.removeEventListener('scroll', this.onScroll);
    }
  }

  @HostListener('window:resize')
  updateDeviceMode(): void {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 900;

    if (wasMobile !== this.isMobile) {
      if (this.isMobile) {
        this.clearAutoSlide();
      } else {
        this.startAutoSlide();
      }
    }
  }

  startAutoSlide(): void {
    this.clearAutoSlide();
    if (!this.isMobile) {
      this.intervalId = setInterval(() => this.nextTestimonial(), 7000);
    }
  }

  clearAutoSlide(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  nextTestimonial(): void {
    if (this.isMobile && this.carousel) {
      const container = this.carousel.nativeElement;
      const nextIndex = (this.currentIndex + 1) % this.testimonials.length;
      const nextCard = container.children[nextIndex] as HTMLElement;
      nextCard.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      this.currentIndex = nextIndex;
    } else {
      this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
    }
  }

  prevTestimonial(): void {
    if (this.isMobile && this.carousel) {
      const container = this.carousel.nativeElement;
      const prevIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
      const prevCard = container.children[prevIndex] as HTMLElement;
      prevCard.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      this.currentIndex = prevIndex;
    } else {
      this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
    }
  }

  goTo(index: number): void {
    this.currentIndex = index;
    if (this.isMobile && this.carousel) {
      const card = this.carousel.nativeElement.children[index] as HTMLElement;
      card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  onScroll = (): void => {
    if (!this.carousel || !this.isMobile) return;

    const container = this.carousel.nativeElement;
    const scrollLeft = container.scrollLeft;
    const containerCenter = scrollLeft + container.offsetWidth / 2;

    const cards = Array.from(container.children);
    let closestIndex = 0;
    let minDistance = Infinity;

    cards.forEach((card, index) => {
      const rect = (card as HTMLElement).getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const distance = Math.abs(cardCenter - window.innerWidth / 2);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    this.currentIndex = closestIndex;
  };
}
