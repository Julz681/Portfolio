import { Component } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header-component.component';
import { HeroComponent } from '../hero/hero-component.component';
import { AboutComponent } from '../about/about-component.component';
import { SkillSetComponent } from '../skill-set/skill-set-component.component';
import { ProjectsComponent } from '../projects/projects-component.component';
import { TestimonialsComponent } from '../testimonials/testimonials-component.component';
import { ContactComponent } from '../contact/contact-component.component';
import { FooterComponent } from '../footer/footer-component.component';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, 
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

