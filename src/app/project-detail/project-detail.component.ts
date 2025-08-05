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
  currentLang: 'en' | 'de' = 'en';
  project: any;
  private route = inject(ActivatedRoute);

  projects = [
    {
      slug: 'join',
      number: '01',
      name: 'Join',
      description: 'Task manager inspired by the Kanban System. Create and organize tasks using drag and drop functions, assign users and categories.',
      description_de: 'Task-Manager inspiriert vom Kanban-System. Erstelle und organisiere Aufgaben per Drag & Drop, weise Benutzer und Kategorien zu.',
      tech: ['CSS', 'HTML', 'Firebase', 'Group',],
      image: 'assets/join.png',
      github: 'https://github.com/Julz681/join',
      live: 'assets/projects/Join/index.html',
    },
    {
      slug: 'el-pollo-loco',
      number: '02',
      name: 'El Pollo Loco',
      description: 'Jump-and-run game inspired by Super Mario, built with JavaScript and canvas rendering.',
      description_de: 'Jump-and-Run-Spiel inspiriert von Super Mario, entwickelt mit JavaScript und Canvas-Rendering.',
      tech: ['JavaScript', 'HTML', 'CSS'],
      image: 'assets/pollo.png',
      github: 'https://github.com/Julz681/Pollo-Loco',
      live: 'assets/projects/Pollo Loco/index.html',

    },

        {
      slug: 'dabubble',
      number: '03',
      name: 'DABubble',
      description: 'Collaboration platform similar to Microsoft Teams, featuring real-time communication, user management, and chat functionality – powered by Firebase and built with Angular.',
      description_de: 'Kollaborationsplattform im Stil von Microsoft Teams zur Kommunikation, Nutzerverwaltung und Chatfunktionalität – mit Echtzeitdaten über Firebase und moderner UI in Angular.',
      tech: ['Angular', 'Firebase', 'TypeScript', 'HTML', 'MD'],
      image: 'assets/dabubble.png',
      github: 'https://github.com/Julz681/DABubble',
      live: 'assets/projects/DABubble/index.html'
    },
    {
      slug: 'bestell-app',
      number: '04',
      name: 'Bestell-App',
      description: 'Online food delivery platform that connects customers with restaurants for easy ordering and fast home delivery.',
      description_de: 'Online-Bestellplattform, die Kunden mit Restaurants verbindet – einfache Bestellung und schnelle Lieferung.',
      tech: ['JavaScript', 'HTML', 'CSS'],
      image: 'assets/bestell_app.png',
      github: 'https://github.com/Julz681/Bestell-App',
      live: 'assets/projects/Bestell-App/index.html',

    },
  
    {
      slug: 'kochwelt',
      number: '05',
      name: 'Kochwelt',
      description: 'A clean and straightforward recipe platform – showcasing how appealing and functional websites can be built without heavy frameworks.',
      description_de: 'Eine übersichtliche Rezeptplattform als Beispiel für moderne, einfache Webentwicklung – zeigt, dass auch funktionale und ansprechende Websites ohne komplexe Frameworks realisierbar sind.',
      tech: ['JavaScript', 'HTML', 'CSS'],
      image: 'assets/kochwelt.png',
      github: 'https://github.com/Julz681/Kochwelt',
      live: 'assets/projects/Kochwelt/index.html',
    },
  ];

  ngOnInit(): void {
    const savedLang = localStorage.getItem('lang');
    if (savedLang === 'de' || savedLang === 'en') {
      this.currentLang = savedLang;
    }

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
      MD: 'md.png',
    };

    const fileName = iconMap[tech] || tech.toLowerCase().replace(/\s+/g, '-') + '.png';
    return 'assets/icons/' + fileName;
  }

  scrollToProjects(): void {
    window.location.href = '/#projects';
  }
}
