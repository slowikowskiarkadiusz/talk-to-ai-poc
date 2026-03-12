import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { AppsComponent } from './apps/apps';
import { PlantGrowthComponent } from './plant-growth/plant-growth';
import { WeatherComponent } from './weather/weather';
import { DevicesComponent } from './devices/devices';
import { AiComponent } from './ai/ai';
import { ArticlesComponent } from './articles/articles';
import { SettingsComponent } from './settings/settings';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'apps', component: AppsComponent },
  { path: 'apps/plant-growth', component: PlantGrowthComponent },
  { path: 'apps/weather', component: WeatherComponent },
  { path: 'apps/devices', component: DevicesComponent },
  { path: 'ai', component: AiComponent },
  { path: 'articles', component: ArticlesComponent },
  { path: 'settings', component: SettingsComponent },
];
