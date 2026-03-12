import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

interface AppItem {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

@Component({
  selector: 'app-apps',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatRippleModule],
  template: `
    <div class="apps-container">
      <h2 class="apps-title">Apps</h2>
      <div class="apps-grid">
        @for (app of apps; track app.route) {
          <a class="app-card" matRipple [routerLink]="app.route">
            <div class="app-icon-wrapper" [style.background]="app.color">
              <mat-icon>{{ app.icon }}</mat-icon>
            </div>
            <span class="app-name">{{ app.title }}</span>
            <span class="app-desc">{{ app.description }}</span>
          </a>
        }
      </div>
    </div>
  `,
  styles: [`
    .apps-container {
      padding: 24px 16px;
    }
    .apps-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 0 20px;
      color: var(--mat-sys-on-surface);
    }
    .apps-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 16px;
    }
    .app-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 12px 16px;
      border-radius: 16px;
      background: var(--mat-sys-surface-container-low);
      text-decoration: none;
      cursor: pointer;
      gap: 8px;
      transition: box-shadow 0.2s;
      &:hover {
        box-shadow: 0 2px 8px rgba(0,0,0,.12);
      }
    }
    .app-icon-wrapper {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      mat-icon {
        color: white;
        font-size: 30px;
        width: 30px;
        height: 30px;
      }
    }
    .app-name {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--mat-sys-on-surface);
      text-align: center;
    }
    .app-desc {
      font-size: 0.72rem;
      color: var(--mat-sys-on-surface-variant);
      text-align: center;
      line-height: 1.3;
    }
  `]
})
export class AppsComponent {
  apps: AppItem[] = [
    {
      title: 'Plant Growth',
      description: 'Plant growth monitoring',
      icon: 'eco',
      route: '/apps/plant-growth',
      color: '#4caf50',
    },
    {
      title: 'Weather',
      description: 'Current weather for your location',
      icon: 'wb_sunny',
      route: '/apps/weather',
      color: '#0ea5e9',
    },
    {
      title: 'Smart Home',
      description: 'Home device status',
      icon: 'home_iot_device',
      route: '/apps/devices',
      color: '#8b5cf6',
    },
  ];
}
