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
      tech: ['CSS', 'HTML', 'Angular', 'Firebase', 'TypeScript'],
      image: 'assets/images/join-preview.png',
      github: 'https://github.com/example/join',
      live: 'https://join.example.com',
    },
    {
      slug: 'el-pollo-loco',
      number: '02',
      name: 'El Pollo Loco',
      description:
        'A jump-and-run game inspired by Super Mario, built with vanilla JavaScript and canvas rendering.',
      tech: ['JavaScript', 'HTML'],
      image: 'assets/images/el-pollo-preview.png',
      github: 'https://github.com/example/el-pollo-loco',
      live: 'https://el-pollo.example.com',
    },
    // Weitere Projekte hier...
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
      // Weitere falls nötig
    };

    const fileName =
      iconMap[tech] || tech.toLowerCase().replace(/\s+/g, '-') + '.png';
    return 'assets/icons/' + fileName;
  }

  scrollToProjects(): void {
    window.location.href = '/#projects';
  }
}
