import { Component } from '@angular/core'; // ✅ Das war der fehlende Import
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header-component/header-component.component';
import { HeroComponent } from '../hero-component/hero-component.component';
import { AboutComponent } from '../about-component/about-component.component';
import { SkillSetComponent } from '../skill-set-component/skill-set-component.component';
import { ProjectsComponent } from '../projects-component/projects-component.component';
import { TestimonialsComponent } from '../testimonials-component/testimonials-component.component';
import { ContactComponent } from '../contact-component/contact-component.component';
import { FooterComponent } from '../footer-component/footer-component.component';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // ✅ HIER
    HeaderComponent,
    HeroComponent,
    AboutComponent,
    SkillSetComponent,
    ProjectsComponent,
    TestimonialsComponent,
    ContactComponent,
    FooterComponent
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent {}

