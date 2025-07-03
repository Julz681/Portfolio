import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then(m => m.HomeComponent)
  },
{
  path: 'projects/:slug',
  loadComponent: () =>
    import('../app/project-detail/project-detail.component').then(m => m.ProjectDetailComponent)
},
{
  path: 'privacy',
  loadComponent: () =>
    import('./privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent)
},
{
  path: 'projects',
  loadComponent: () =>
    import('./projects/projects-component.component').then(m => m.ProjectsComponent)
},
{
  path: 'contact',
  loadComponent: () =>
    import('./contact/contact-component.component').then(m => m.ContactComponent)
}


];
