import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="settings-container">
      <h2 class="settings-title">Settings</h2>
      <div class="settings-list">
        @for (item of items; track item.label) {
          <div class="settings-item">
            <div class="settings-item-icon">
              <mat-icon>{{ item.icon }}</mat-icon>
            </div>
            <div class="settings-item-content">
              <span class="settings-item-label">{{ item.label }}</span>
              <span class="settings-item-value">{{ item.value }}</span>
            </div>
            <mat-icon class="settings-item-arrow">chevron_right</mat-icon>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      padding: 24px 16px;
    }
    .settings-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 0 24px;
      color: var(--mat-sys-on-surface);
    }
    .settings-list {
      display: flex;
      flex-direction: column;
      gap: 2px;
      border-radius: 12px;
      overflow: hidden;
      background: var(--mat-sys-surface-container-low);
    }
    .settings-item {
      display: flex;
      align-items: center;
      padding: 14px 16px;
      gap: 16px;
      cursor: pointer;
      background: var(--mat-sys-surface-container-low);
      transition: background 0.15s;
      &:hover {
        background: var(--mat-sys-surface-container);
      }
    }
    .settings-item-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: var(--mat-sys-surface-container-high);
      display: flex;
      align-items: center;
      justify-content: center;
      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
        color: var(--mat-sys-primary);
      }
    }
    .settings-item-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .settings-item-label {
      font-size: 0.95rem;
      color: var(--mat-sys-on-surface);
    }
    .settings-item-value {
      font-size: 0.8rem;
      color: var(--mat-sys-on-surface-variant);
    }
    .settings-item-arrow {
      color: var(--mat-sys-outline);
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
  `]
})
export class SettingsComponent {
  items = [
    { icon: 'person', label: 'Account', value: 'Manage profile' },
    { icon: 'notifications', label: 'Notifications', value: 'Enabled' },
    { icon: 'palette', label: 'Appearance', value: 'Light theme' },
    { icon: 'language', label: 'Language', value: 'English' },
    { icon: 'info', label: 'About', value: 'Version 1.0.0' },
  ];
}
