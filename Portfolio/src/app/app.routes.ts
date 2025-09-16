import { Routes, ExtraOptions } from '@angular/router';
import { FullLayoutComponent } from './layout/full-layout.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'projects/:slug',
    loadComponent: () =>
      import('./project-detail/project-detail.component').then(
        (m) => m.ProjectDetailComponent
      ),
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./projects/projects-component.component').then(
        (m) => m.ProjectsComponent
      ),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./contact/contact-component.component').then(
        (m) => m.ContactComponent
      ),
  },
  {
    path: 'privacy',
    component: FullLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./privacy-policy/privacy-policy.component').then(
            (m) => m.PrivacyPolicyComponent
          ),
      },
    ],
  },
  {
    path: 'legal',
    component: FullLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./legal-notice/legal-notice.component').then(
            (m) => m.LegalNoticeComponent
          ),
      },
    ],
  },
];

export const routerOptions: ExtraOptions = {
  anchorScrolling: 'enabled',
  scrollPositionRestoration: 'enabled',
  scrollOffset: [0, 64],
};
