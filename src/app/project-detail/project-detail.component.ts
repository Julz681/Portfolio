import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
})
export class ProjectDetailComponent {
  project: any;

  projects = [
    {
      slug: 'join',
      number: '01',
      name: 'Join',
      description:
        'Task manager inspired by the Kanban System. Create and organize tasks using drag and drop functions, assign users and categories.',
      tech: ['CSS', 'HTML', 'Firebase', 'Angular', 'TypeScript'],
      image: 'assets/images/join-preview.png',
      github: 'https://github.com/example',
      live: 'https://example.com',
    },
    {
      slug: 'el-pollo-loco',
      number: '02',
      name: 'El Pollo Loco',
      description: 'Jump’n’Run browser game with hand-drawn animations.',
      tech: ['JavaScript', 'HTML', 'CSS'],
      image: 'assets/images/el-pollo-preview.png',
      github: 'https://github.com/example2',
      live: 'https://example2.com',
    }
  ];

  constructor(private route: ActivatedRoute) {
    const slug = this.route.snapshot.paramMap.get('slug');
    this.project = this.projects.find((p) => p.slug === slug);
  }
}
