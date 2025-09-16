import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-projects-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './projects-component.component.html',
  styleUrls: ['./projects-component.component.scss'],
})
export class ProjectsComponent {
  @Input() currentLang: 'en' | 'de' = 'en';
  hovered: any = null;

  projects = [
    {
      slug: 'join',
      name: 'Join',
      tags: 'HTML | CSS | JavaScript | Firebase',
      image: 'assets/join.png',
    },
    {
      slug: 'el-pollo-loco',
      name: 'El Pollo Loco',
      tags: 'HTML | CSS | JavaScript',
      image: 'assets/pollo.png',
    },
    {
      slug: 'bestell-app',
      name: 'Bestell-App',
      tags: 'HTML | CSS | JavaScript',
      image: 'assets/bestell_app.png',
    },
    {
      slug: 'dabubble',
      name: 'DABubble',
      tags: 'HTML | SCSS | TypeScript | Material Design | Firebase',
      image: 'assets/dabubble.png',
    },
    {
      slug: 'kochwelt',
      name: 'Kochwelt',
      tags: 'HTML | CSS | JavaScript',
      image: 'assets/kochwelt.png',
    },
  ];

  constructor(private router: Router) {}

  scrollToProjects(): void {
    this.router.navigate(['/'], { fragment: 'projects' });
  }
}
