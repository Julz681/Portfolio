import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header-component.component';
import { FooterComponent } from '../footer/footer-component.component';
@Component({
  selector: 'app-full-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    FooterComponent
  ],
  template: `
    <div class="layout-wrapper">
      <app-header></app-header>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .layout-wrapper {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .main-content {
      flex: 1;
      max-width: 2100px;
      margin: 0 auto;
      padding: 2rem;
      display: flex;
      flex-direction: column;
    }
  `]
})
export class FullLayoutComponent {}

