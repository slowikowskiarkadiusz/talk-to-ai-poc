import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { filter } from 'rxjs';
import { AiReactionService } from '../ai-reaction.service';

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
  templateUrl: './devices.html',
  styleUrl: './devices.scss'
})
export class DevicesComponent {
  changeDetector = inject(ChangeDetectorRef);
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

  constructor(aiReactionService: AiReactionService) {
    aiReactionService
      .subject
      .pipe(filter(x => x.appName == "devices"))
      .subscribe(x => {
        if (x.action == "dim lamp") {
          const device = this.devices.filter(d => d.name.replace(' lamp', '') == x.actionValues[0].replace(' lamp', ''))[0];
          if (device) {
            document.getElementById(x.actionValues[0])?.scrollIntoView({ behavior: 'smooth' });
            this.changeDetector.markForCheck();
            const changeValue = (dir: number) => setTimeout(() => {
              device.value! += 1 * dir;
              this.changeDetector.markForCheck();
              if (device.value != +x.actionValues[1]) {
                if (Math.abs(device.value! - +x.actionValues[1]) < 1)
                  device.value = +x.actionValues[1];
                else
                  changeValue(dir);
              }
            });
            setTimeout(() => {
              changeValue(device.value! > +x.actionValues[1] ? -1 : 1);
            }, 1000);
          }
        } else if (x.action == "tweak thermostat") {
          const device = this.devices.filter(d => d.name == "Thermostat")[0];
          if (device) {
            document.getElementById("Thermostat")?.scrollIntoView({ behavior: 'smooth' });
            this.changeDetector.markForCheck();
            const changeValue = (dir: number) => setTimeout(() => {
              device.value! += 0.05 * dir;
              device.value = Math.round(device.value! * 100) / 100
              this.changeDetector.markForCheck();
              if (device.value != +x.actionValues[0]) {
                if (Math.abs(device.value! - +x.actionValues[0]) < 1)
                  device.value = +x.actionValues[0];
                else
                  changeValue(dir);
              }
            });
            setTimeout(() => {
              changeValue(device.value! > +x.actionValues[0] ? -1 : 1);
            }, 1000);
          }
        }
        else if (x.action == "turn device on or off") {
          const device = this.devices.filter(d => d.name.includes(x.actionValues[0]))[0];
          if (device) {
            document.getElementById(device.name)?.scrollIntoView({ behavior: 'smooth' });
            this.changeDetector.markForCheck();
            setTimeout(() => {
              device.status = x.actionValues[1];
              this.changeDetector.markForCheck();
            }, 1000);
          }
        }
      });
  }

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
