import { Component } from '@angular/core';
import { HeaderComponent } from './header-component/header-component.component';
import { HeroComponent } from './hero-component/hero-component.component';
import { AboutComponent } from './about-component/about-component.component';
import { SkillSetComponent } from './skill-set-component/skill-set-component.component';
import { ProjectsComponent } from './projects-component/projects-component.component';
import { TestimonialsComponent } from './testimonials-component/testimonials-component.component';
import { ContactComponent } from './contact-component/contact-component.component';
import { FooterComponent } from './footer-component/footer-component.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    HeroComponent,
    AboutComponent,
    SkillSetComponent,
    ProjectsComponent,
    TestimonialsComponent,
    ContactComponent,
    FooterComponent,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {}
