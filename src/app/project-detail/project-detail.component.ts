import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
})
export class ProjectDetailComponent implements OnInit {
  project: any;
  private route = inject(ActivatedRoute);

  projects = [
    {
      slug: 'join',
      number: '01',
      name: 'Join',
      description:
        'Task manager inspired by the Kanban System. Create and organize tasks using drag and drop functions, assign users and categories.',
      tech: ['CSS', 'HTML', 'Firebase'],
      image: 'assets/join.png',
      github: 'https://github.com/Julz681/join',
      live: 'https://join.example.com',
    },
    {
      slug: 'el-pollo-loco',
      number: '02',
      name: 'El Pollo Loco',
      description:
        'Jump-and-run game inspired by Super Mario, built with JavaScript and canvas rendering.',
      tech: ['JavaScript', 'HTML', 'CSS'],
      image: 'assets/pollo.png',
      github: 'https://github.com/Julz681/Pollo-Loco',
      live: 'https://el-pollo.example.com',
    },
    {
      slug: 'bestell-app',
      number: '03',
      name: 'Bestell-App',
      description:
        'Online food delivery platform that connects customers with restaurants for easy ordering and fast home delivery, built during a group-project with vanilla JavaScript.',
      tech: ['JavaScript', 'HTML', 'CSS'],
      image: 'assets/bestell_app.png',
      github: 'https://github.com/Julz681/Bestell-App',
      live: 'https://el-pollo.example.com',
    },
    {
      slug: 'pokedex',
      number: '04',
      name: 'Pokédex',
      description:
        'Pokédex-style trainer registry that fetches and displays Pokémon data using an external API – with a touch of nostalgic fun',
      tech: ['JavaScript', 'HTML', 'CSS'],
      image: 'assets/pokedex.png',
      github: 'https://github.com/Julz681/Pokedex',
      live: 'https://el-pollo.example.com',
    },
    {
      slug: 'kochwelt',
      number: '05',
      name: 'Kochwelt',
      description:
        'Recipe platform that allows users to browse, discover, and share a variety of dishes in a clean, beginner-friendly interface.',
      tech: ['JavaScript', 'HTML', 'CSS'],
      image: 'assets/kochwelt.png',
      github: 'https://github.com/Julz681/Kochwelt',
      live: 'https://el-pollo.example.com',
    },

    // Angular Projekt folgt dann mit DABubble
  ];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      this.project = this.projects.find((p) => p.slug === slug);
    });
  }

  getNextProjectSlug(): string {
    const index = this.projects.findIndex((p) => p.slug === this.project?.slug);
    const nextIndex = (index + 1) % this.projects.length;
    return this.projects[nextIndex].slug;
  }

  getTechIcon(tech: string): string {
    const iconMap: { [key: string]: string } = {
      JavaScript: 'js.png',
      JS: 'js.png',
      TypeScript: 'ts.png',
      TS: 'ts.png',
      Firebase: 'firebase.png',
      CSS: 'css.png',
      HTML: 'html.png',
      Angular: 'angular.png',
      Git: 'git.png',
      Scrum: 'scrum.png',
      Group: 'group_small.png',
    };

    const fileName =
      iconMap[tech] || tech.toLowerCase().replace(/\s+/g, '-') + '.png';
    return 'assets/icons/' + fileName;
  }

  scrollToProjects(): void {
    window.location.href = '/#projects';
  }
}
