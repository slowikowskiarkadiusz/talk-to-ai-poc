import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="articles-container">
      <h2 class="articles-title">Articles</h2>
      <div class="empty-state">
        <mat-icon class="empty-icon">article</mat-icon>
        <p>No articles</p>
        <span>Content will appear here soon.</span>
      </div>
    </div>
  `,
  styles: [`
    .articles-container {
      padding: 24px 16px;
    }
    .articles-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 0 24px;
      color: var(--mat-sys-on-surface);
    }
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      text-align: center;
    }
    .empty-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: var(--mat-sys-outline);
      margin-bottom: 16px;
    }
    p {
      font-size: 1.1rem;
      font-weight: 500;
      color: var(--mat-sys-on-surface);
      margin: 0 0 4px;
    }
    span {
      font-size: 0.9rem;
      color: var(--mat-sys-on-surface-variant);
    }
  `]
})
export class ArticlesComponent {}
