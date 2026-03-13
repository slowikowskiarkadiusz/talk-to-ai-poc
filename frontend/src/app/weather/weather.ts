import { DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface WeatherData {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
    is_day: number;
  };
}

interface HourlyData {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
}

const WMO_CODES: Record<number, { label: string; icon: string }> = {
  0: { label: 'Clear sky', icon: 'wb_sunny' },
  1: { label: 'Mostly clear', icon: 'wb_sunny' },
  2: { label: 'Partly cloudy', icon: 'partly_cloudy_day' },
  3: { label: 'Overcast', icon: 'cloud' },
  45: { label: 'Fog', icon: 'foggy' },
  48: { label: 'Rime fog', icon: 'foggy' },
  51: { label: 'Light drizzle', icon: 'grain' },
  53: { label: 'Moderate drizzle', icon: 'grain' },
  55: { label: 'Dense drizzle', icon: 'grain' },
  61: { label: 'Light rain', icon: 'rainy' },
  63: { label: 'Moderate rain', icon: 'rainy' },
  65: { label: 'Heavy rain', icon: 'rainy' },
  71: { label: 'Light snow', icon: 'ac_unit' },
  73: { label: 'Moderate snow', icon: 'ac_unit' },
  75: { label: 'Heavy snow', icon: 'ac_unit' },
  80: { label: 'Rain showers', icon: 'rainy_light' },
  81: { label: 'Rain showers', icon: 'rainy' },
  82: { label: 'Violent rain', icon: 'thunderstorm' },
  95: { label: 'Thunderstorm', icon: 'thunderstorm' },
  96: { label: 'Thunderstorm w/ hail', icon: 'thunderstorm' },
  99: { label: 'Thunderstorm w/ hail', icon: 'thunderstorm' },
};

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatIconModule, MatButtonModule, DecimalPipe],
  template: `
    <div class="weather-container">
      @if (loading) {
        <div class="center-state">
          <mat-spinner diameter="48"></mat-spinner>
          <p>Fetching location and weather…</p>
        </div>
      } @else if (error) {
        <div class="center-state error">
          <mat-icon>error_outline</mat-icon>
          <p>{{ error }}</p>
          <button mat-stroked-button (click)="load()">Try again</button>
        </div>
      } @else if (weather) {
        <div class="hero">
          <div class="location">
            <mat-icon>location_on</mat-icon>
            <span>{{ locationName }}</span>
          </div>
          <mat-icon class="weather-icon">{{ conditionIcon }}</mat-icon>
          <div class="temp">{{ weather.current.temperature_2m | number:'1.0-0' }}°C</div>
          <div class="condition">{{ conditionLabel }}</div>
          <div class="feels-like">Feels like {{ weather.current.apparent_temperature | number:'1.0-0' }}°C</div>
        </div>

        <div class="details-grid">
          <div class="detail-card">
            <mat-icon>water_drop</mat-icon>
            <span class="detail-value">{{ weather.current.relative_humidity_2m }}%</span>
            <span class="detail-label">Humidity</span>
          </div>
          <div class="detail-card">
            <mat-icon>air</mat-icon>
            <span class="detail-value">{{ weather.current.wind_speed_10m | number:'1.0-0' }} km/h</span>
            <span class="detail-label">Wind</span>
          </div>
        </div>

        @if (hourly.length) {
          <div class="hourly-section">
            <h3>Upcoming hours</h3>
            <div class="hourly-scroll">
              @for (h of hourly; track h.time) {
                <div class="hourly-item">
                  <span class="h-time">{{ h.time }}</span>
                  <mat-icon class="h-icon">{{ h.icon }}</mat-icon>
                  <span class="h-temp">{{ h.temp | number:'1.0-0' }}°</span>
                </div>
              }
            </div>
          </div>
        }

        <div class="refresh-row">
          <button mat-icon-button (click)="load()" title="Refresh">
            <mat-icon>refresh</mat-icon>
          </button>
          <span class="updated-at">Updated: {{ updatedAt }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .weather-container {
      padding: 24px 16px 96px;
      max-width: 100%;
      margin: 0 auto;
    }
    .center-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 60px 0;
      color: var(--mat-sys-on-surface-variant);
      mat-icon { font-size: 48px; width: 48px; height: 48px; }
      &.error mat-icon { color: var(--mat-sys-error); }
    }
    .hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 32px 16px 24px;
      gap: 4px;
    }
    .location {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.95rem;
      color: var(--mat-sys-on-surface-variant);
      margin-bottom: 8px;
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
    }
    .weather-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: var(--mat-sys-primary);
      margin: 8px 0;
    }
    .temp {
      font-size: 4rem;
      font-weight: 300;
      line-height: 1;
      color: var(--mat-sys-on-surface);
    }
    .condition {
      font-size: 1.1rem;
      color: var(--mat-sys-on-surface-variant);
      margin-top: 4px;
    }
    .feels-like {
      font-size: 0.85rem;
      color: var(--mat-sys-on-surface-variant);
    }
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 8px;
    }
    .detail-card {
      background: var(--mat-sys-surface-container-low);
      border-radius: 16px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      mat-icon { color: var(--mat-sys-primary); }
    }
    .detail-value {
      font-size: 1.2rem;
      font-weight: 500;
      color: var(--mat-sys-on-surface);
    }
    .detail-label {
      font-size: 0.78rem;
      color: var(--mat-sys-on-surface-variant);
    }
    .hourly-section {
      margin-top: 24px;
      h3 {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--mat-sys-on-surface-variant);
        margin: 0 0 12px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }
    .hourly-scroll {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 8px;
    }
    .hourly-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      background: var(--mat-sys-surface-container-low);
      border-radius: 12px;
      padding: 12px 14px;
      min-width: 60px;
      flex-shrink: 0;
    }
    .h-time { font-size: 0.78rem; color: var(--mat-sys-on-surface-variant); }
    .h-icon { font-size: 22px; width: 22px; height: 22px; color: var(--mat-sys-primary); }
    .h-temp { font-size: 0.95rem; font-weight: 500; color: var(--mat-sys-on-surface); }
    .refresh-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 20px;
      color: var(--mat-sys-on-surface-variant);
    }
    .updated-at { font-size: 0.78rem; }
  `]
})
export class WeatherComponent implements OnInit {
  loading = true;
  error: string | null = null;
  weather: WeatherData | null = null;
  locationName = '';
  updatedAt = '';
  conditionLabel = '';
  conditionIcon = 'wb_sunny';
  hourly: { time: string; temp: number; icon: string }[] = [];

  private lat = 0;
  private lon = 0;

  constructor(private http: HttpClient, private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = null;

    if (!navigator.geolocation) {
      this.error = 'Geolocation is not supported by this browser.';
      this.loading = false;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.lat = pos.coords.latitude;
        this.lon = pos.coords.longitude;
        this.fetchWeather();
        this.fetchLocationName();
      },
      () => {
        this.error = 'Could not retrieve location. Check browser permissions.';
        this.loading = false;
      }
    );
  }

  private fetchWeather() {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.lat}&longitude=${this.lon}` +
      `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day` +
      `&hourly=temperature_2m,weather_code&forecast_days=1&timezone=auto`;

    this.http.get<WeatherData & { hourly: HourlyData }>(url).subscribe({
      next: (data) => {
        this.weather = data;
        const code = data.current.weather_code;
        this.conditionLabel = WMO_CODES[code]?.label ?? 'Unknown';
        this.conditionIcon = WMO_CODES[code]?.icon ?? 'wb_cloudy';
        this.buildHourly(data.hourly);
        this.updatedAt = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        this.loading = false;
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.error = 'Could not fetch weather data.';
        this.loading = false;
      }
    });
  }

  private buildHourly(hourly: HourlyData) {
    const now = new Date();
    const currentHour = now.getHours();
    this.hourly = [];
    for (let i = 0; i < hourly.time.length; i++) {
      const h = new Date(hourly.time[i]).getHours();
      if (h >= currentHour && this.hourly.length < 8) {
        this.hourly.push({
          time: `${String(h).padStart(2, '0')}:00`,
          temp: hourly.temperature_2m[i],
          icon: WMO_CODES[hourly.weather_code[i]]?.icon ?? 'wb_cloudy',
        });
      }
    }
  }

  private fetchLocationName() {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${this.lat}&lon=${this.lon}&format=json`;
    this.http.get<{ address: { city?: string; town?: string; village?: string; country?: string } }>(url).subscribe({
      next: (data) => {
        const city = data.address.city ?? data.address.town ?? data.address.village ?? '';
        const country = data.address.country ?? '';
        this.locationName = [city, country].filter(Boolean).join(', ');
      },
      error: () => {
        this.locationName = `${this.lat.toFixed(2)}, ${this.lon.toFixed(2)}`;
      }
    });
  }
}
