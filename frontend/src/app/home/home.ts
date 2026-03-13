import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="home-container">
      <mat-icon class="home-icon">waving_hand</mat-icon>
      <h1>Hello!</h1>
      <p>Good to see you. Choose an app or start a conversation with AI.</p>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex: 1;
      height: 100%;
    }
    .home-container {
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
    .home-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: var(--mat-sys-primary);
      margin-bottom: 16px;
    }
    h1 {
      font-size: 2rem;
      margin: 0 0 8px;
      color: var(--mat-sys-on-surface);
    }
    p {
      color: var(--mat-sys-on-surface-variant);
      font-size: 1rem;
      max-width: 100%;
      line-height: 1.5;
    }
  `]
})
export class HomeComponent { }
