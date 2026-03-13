import { bootstrapApplication } from '@angular/platform-browser';
import { pushAiProcessor } from './app/ai-processors/list';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { devicesAiProcessor } from './app/ai-processors/devices.ai-processor';
import { plantGrowthAiProcessor } from './app/ai-processors/plant-growth.ai-processor';
import { weatherAiProcessor } from './app/ai-processors/weather.ai-processor';

pushAiProcessor(devicesAiProcessor, weatherAiProcessor, plantGrowthAiProcessor);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
