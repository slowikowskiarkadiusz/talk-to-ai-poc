import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ai',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="ai-container">
      <div class="ai-icon-wrapper">
        <mat-icon class="ai-icon">diamond</mat-icon>
      </div>
      <h1>AI Assistant</h1>
      <p>Intelligent help coming soon.</p>
      <span class="badge">Coming soon</span>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      height: 100%;
    }
    .ai-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      padding: 24px;
      text-align: center;
      box-sizing: border-box;
    }
    .ai-icon-wrapper {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
      box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
    }
    .ai-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: white;
    }
    h1 {
      font-size: 2rem;
      margin: 0 0 8px;
      color: var(--mat-sys-on-surface);
    }
    p {
      color: var(--mat-sys-on-surface-variant);
      font-size: 1rem;
      margin: 0 0 20px;
    }
    .badge {
      padding: 6px 16px;
      border-radius: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-size: 0.8rem;
      font-weight: 500;
    }
  `]
})
export class AiComponent {}
