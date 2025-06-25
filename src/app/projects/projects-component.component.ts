import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './projects-component.component.html',
  styleUrls: ['./projects-component.component.scss'],
})
export class ProjectsComponent {
  hovered: any = null;

  projects = [
    {
      slug: 'join',
      name: 'Join',
      tags: 'Angular | TypeScript | HTML | CSS | Firebase',
      image: 'assets/images/join-preview.png',
    },
    {
      slug: 'el-pollo-loco',
      name: 'El Pollo Loco',
      tags: 'HTML | CSS | JavaScript',
      image: 'assets/images/el-pollo-preview.png',
    },
    {
      slug: 'da-bubble',
      name: 'DA Bubble',
      tags: 'Angular | Firebase | TypeScript',
      image: 'assets/images/da-bubble-preview.png',
    },
  ];

  constructor(private router: Router) {}

  scrollToProjects(): void {
    this.router.navigate(['/'], { fragment: 'projects' });
  }
}
