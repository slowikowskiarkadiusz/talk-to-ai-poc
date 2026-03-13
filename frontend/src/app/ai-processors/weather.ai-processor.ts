import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AiAction, AiProcessor } from "./ai-processor";

export const weatherAiProcessor = new AiProcessor(
  "weather", [
  new AiAction("show forecast", [], p => { inject(Router).navigate(['apps', 'weather']) }),
],
  [
    ["Will it rain tomorrow?", "weather", "show forecast"]
  ]
);
