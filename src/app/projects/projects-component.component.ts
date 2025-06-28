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
      tags: 'HTML | CSS | JavaScript',
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
      slug: 'pokedex',
      name: 'Pokédex',
      tags: 'HTML | CSS | JavaScript',
      image: 'assets/pokedex.png',
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
