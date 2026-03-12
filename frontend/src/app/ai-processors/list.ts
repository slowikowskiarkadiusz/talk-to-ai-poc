import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AiAction, AiActionParameter, AiProcessor } from "./ai-processor";

export const aiProcessors: AiProcessor[] = [];

export function pushAiProcessor(processor: AiProcessor) {
  aiProcessors.push(processor);
}

pushAiProcessor(new AiProcessor(
  "weather", [
  new AiAction("show forecast", [], p => { inject(Router).navigate(['apps', 'weather']) }),
],
  [
    ["Will it rain tomorrow?", "weather", "show forecast"]
  ]));


pushAiProcessor(new AiProcessor(
  "devices",
  [
    new AiAction("turn device on or off", [
      new AiActionParameter("deviceName", "string", "the name of the device")
    ],
      p => { inject(Router).navigate(['apps', 'devices']) }),
    new AiAction("tweak thermostat", [], p => { inject(Router).navigate(['apps', 'devices']) }),
    new AiAction("dim lamp", [
      new AiActionParameter("lampName", "string", "the name of the lamp")
    ], p => { inject(Router).navigate(['apps', 'devices']) }),
  ],
  [
    ["It's too cold in here", "devices", "tweak thermostat"],
    ["Turn off the lights", "devices", "turn device on or off"],
    ["Make it darker", "devices", "dim lamp"]
  ]));

pushAiProcessor(new AiProcessor(
  "plant growth",
  [
    new AiAction("create report", [], p => { inject(Router).navigate(['apps', 'plant-growth']) }),
    new AiAction("show chart", [
      new AiActionParameter("property", "string", "the name of the property to show on the chart. one of: [ PlantHeight, StemWidth, LeafWidth, BedDepth]")],
      p => { inject(Router).navigate(['apps', 'plant-growth']) }
    )
  ],
  [
    ["Show me crop data", "plant growth", "show chart"],
    ["I need a field report", "plant growth", "create report"]
  ]));
