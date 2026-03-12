import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { Router } from '@angular/router';
import { AiAction, AiActionParameter, AiProcessableComponent, AiProcessor } from '../ai-processors/ai-processor';
import { pushAiProcessor } from '../ai-processors/list';

type DeviceType = 'light' | 'thermostat' | 'plug' | 'camera' | 'lock' | 'sensor';
type DeviceStatus = 'on' | 'off' | 'locked' | 'unlocked' | 'motion' | 'idle';

interface Device {
  id: number;
  name: string;
  room: string;
  type: DeviceType;
  status: DeviceStatus;
  value?: number;
  unit?: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [MatIconModule, MatSlideToggleModule, MatSliderModule, MatChipsModule, FormsModule],
  template: `
    <div class="devices-container">
      <div class="summary-row">
        <div class="summary-card">
          <mat-icon>power</mat-icon>
          <span class="s-value">{{ activeCount }}</span>
          <span class="s-label">Active</span>
        </div>
        <div class="summary-card">
          <mat-icon>devices</mat-icon>
          <span class="s-value">{{ devices.length }}</span>
          <span class="s-label">Devices</span>
        </div>
        <div class="summary-card">
          <mat-icon>meeting_room</mat-icon>
          <span class="s-value">{{ rooms.length }}</span>
          <span class="s-label">Rooms</span>
        </div>
      </div>

      <div class="filter-chips">
        <mat-chip-listbox [(ngModel)]="selectedRoom" aria-label="Room filter">
          <mat-chip-option value="">All</mat-chip-option>
          @for (room of rooms; track room) {
            <mat-chip-option [value]="room">{{ room }}</mat-chip-option>
          }
        </mat-chip-listbox>
      </div>

      <div class="devices-grid">
        @for (device of filteredDevices; track device.id) {
          <div class="device-card" [class.active]="isActive(device)">
            <div class="device-header">
              <div class="device-icon-wrap" [style.background]="isActive(device) ? device.color : '#9e9e9e'">
                <mat-icon>{{ device.icon }}</mat-icon>
              </div>
              <div class="device-info">
                <span class="device-name">{{ device.name }}</span>
                <span class="device-room">{{ device.room }}</span>
              </div>
              @if (device.type === 'light' || device.type === 'plug') {
                <mat-slide-toggle
                  [checked]="device.status === 'on'"
                  (change)="toggleDevice(device)"
                  color="primary">
                </mat-slide-toggle>
              } @else if (device.type === 'lock') {
                <button class="lock-btn" (click)="toggleLock(device)">
                  <mat-icon>{{ device.status === 'locked' ? 'lock' : 'lock_open' }}</mat-icon>
                </button>
              }
            </div>

            @if (device.type === 'thermostat' && device.value !== undefined) {
              <div class="thermostat-control">
                <span class="thermo-val">{{ device.value }}{{ device.unit }}</span>
                <div class="thermo-buttons">
                  <button class="thermo-btn" (click)="adjustTemp(device, -0.5)">
                    <mat-icon>remove</mat-icon>
                  </button>
                  <button class="thermo-btn" (click)="adjustTemp(device, 0.5)">
                    <mat-icon>add</mat-icon>
                  </button>
                </div>
              </div>
            }

            @if (device.type === 'light' && device.status === 'on' && device.value !== undefined) {
              <div class="brightness-row">
                <mat-icon class="dim-icon">brightness_low</mat-icon>
                <mat-slider min="10" max="100" step="10" discrete [displayWith]="formatBrightness" style="flex:1">
                  <input matSliderThumb [(ngModel)]="device.value">
                </mat-slider>
                <mat-icon class="dim-icon">brightness_high</mat-icon>
              </div>
            }

            <div class="status-badge" [class.status-on]="isActive(device)" [class.status-off]="!isActive(device)">
              {{ statusLabel(device) }}
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .devices-container {
      padding: 16px 16px 96px;
    }
    .summary-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 16px;
    }
    .summary-card {
      background: var(--mat-sys-surface-container-low);
      border-radius: 14px;
      padding: 14px 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      mat-icon { color: var(--mat-sys-primary); font-size: 22px; width: 22px; height: 22px; }
    }
    .s-value { font-size: 1.4rem; font-weight: 600; color: var(--mat-sys-on-surface); line-height: 1; }
    .s-label { font-size: 0.72rem; color: var(--mat-sys-on-surface-variant); }
    .filter-chips {
      margin-bottom: 16px;
    }
    .devices-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 12px;
    }
    .device-card {
      background: var(--mat-sys-surface-container-low);
      border-radius: 16px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      border: 1.5px solid transparent;
      transition: border-color 0.2s;
      &.active {
        border-color: var(--mat-sys-primary);
      }
    }
    .device-header {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .device-icon-wrap {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 0.3s;
      mat-icon { color: white; font-size: 22px; width: 22px; height: 22px; }
    }
    .device-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }
    .device-name {
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--mat-sys-on-surface);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .device-room {
      font-size: 0.75rem;
      color: var(--mat-sys-on-surface-variant);
    }
    .lock-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      mat-icon { color: var(--mat-sys-on-surface-variant); font-size: 24px; width: 24px; height: 24px; }
      &:hover mat-icon { color: var(--mat-sys-primary); }
    }
    .thermostat-control {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 4px;
    }
    .thermo-val {
      font-size: 1.6rem;
      font-weight: 300;
      color: var(--mat-sys-on-surface);
    }
    .thermo-buttons {
      display: flex;
      gap: 4px;
    }
    .thermo-btn {
      background: var(--mat-sys-surface-container);
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover { background: var(--mat-sys-surface-container-high); }
      mat-icon { font-size: 18px; width: 18px; height: 18px; color: var(--mat-sys-on-surface); }
    }
    .brightness-row {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .dim-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--mat-sys-on-surface-variant);
    }
    .status-badge {
      font-size: 0.72rem;
      font-weight: 500;
      padding: 3px 10px;
      border-radius: 99px;
      align-self: flex-start;
      &.status-on {
        background: color-mix(in srgb, var(--mat-sys-primary) 15%, transparent);
        color: var(--mat-sys-primary);
      }
      &.status-off {
        background: var(--mat-sys-surface-container);
        color: var(--mat-sys-on-surface-variant);
      }
    }
  `]
})
export class DevicesComponent {
  selectedRoom = '';

  devices: Device[] = [
    { id: 1, name: 'Ceiling lamp', room: 'Living room', type: 'light', status: 'on', value: 80, unit: '%', icon: 'light', color: '#f59e0b' },
    { id: 2, name: 'Floor lamp', room: 'Living room', type: 'light', status: 'off', value: 50, unit: '%', icon: 'floor_lamp', color: '#f59e0b' },
    { id: 3, name: 'Thermostat', room: 'Living room', type: 'thermostat', status: 'on', value: 21.5, unit: '°C', icon: 'thermostat', color: '#ef4444' },
    { id: 4, name: 'TV plug', room: 'Living room', type: 'plug', status: 'on', icon: 'power', color: '#6366f1' },
    { id: 5, name: 'Night lamp', room: 'Bedroom', type: 'light', status: 'off', value: 30, unit: '%', icon: 'light', color: '#f59e0b' },
    { id: 6, name: 'Camera', room: 'Bedroom', type: 'camera', status: 'idle', icon: 'videocam', color: '#0ea5e9' },
    { id: 7, name: 'Door lock', room: 'Hallway', type: 'lock', status: 'locked', icon: 'lock', color: '#10b981' },
    { id: 8, name: 'Motion sensor', room: 'Hallway', type: 'sensor', status: 'idle', icon: 'sensors', color: '#8b5cf6' },
    { id: 9, name: 'Kitchen lamp', room: 'Kitchen', type: 'light', status: 'on', value: 100, unit: '%', icon: 'light', color: '#f59e0b' },
    { id: 10, name: 'Coffee maker', room: 'Kitchen', type: 'plug', status: 'off', icon: 'coffee_maker', color: '#6366f1' },
    { id: 11, name: 'Front camera', room: 'Outside', type: 'camera', status: 'motion', icon: 'videocam', color: '#0ea5e9' },
    { id: 12, name: 'Smoke detector', room: 'Kitchen', type: 'sensor', status: 'idle', icon: 'detector_smoke', color: '#8b5cf6' },
  ];

  get rooms() {
    return [...new Set(this.devices.map(d => d.room))];
  }

  get filteredDevices() {
    return this.selectedRoom ? this.devices.filter(d => d.room === this.selectedRoom) : this.devices;
  }

  get activeCount() {
    return this.devices.filter(d => this.isActive(d)).length;
  }

  isActive(device: Device) {
    return device.status === 'on' || device.status === 'motion' || device.status === 'unlocked';
  }

  toggleDevice(device: Device) {
    device.status = device.status === 'on' ? 'off' : 'on';
  }

  toggleLock(device: Device) {
    device.status = device.status === 'locked' ? 'unlocked' : 'locked';
  }

  adjustTemp(device: Device, delta: number) {
    if (device.value !== undefined) {
      device.value = Math.round((device.value + delta) * 10) / 10;
    }
  }

  statusLabel(device: Device): string {
    const map: Record<DeviceStatus, string> = {
      on: 'On',
      off: 'Off',
      locked: 'Locked',
      unlocked: 'Unlocked',
      motion: 'Motion detected',
      idle: 'Standby',
    };
    return map[device.status] ?? device.status;
  }

  formatBrightness(value: number) {
    return `${value}%`;
  }
}
