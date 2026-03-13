import { inject, runInInjectionContext } from "@angular/core";
import { Router } from "@angular/router";
import { AiReactionService } from "../ai-reaction.service";
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
      new AiActionParameter("onOrOff", "string", "target status. either on or off"),
      new AiActionParameter("deviceName", "string", 'the name of the device. One of: ["Ceiling lamp",  "Floor lamp",  "Thermostat",  "TV plug",  "Night lamp",  "Camera",  "Door lock",  "Motion sensor",  "Kitchen lamp",  "Coffee maker",  "Front camera",  "Smoke detector"]')
    ],
      (p, injector) => {
        {
          inject(Router)
            .navigate(['apps', 'devices'])
            .then(x => {
              runInInjectionContext(injector, () => {
                const aiReactionService = inject(AiReactionService);
                setTimeout(() => {
                  const aiReaction = { appName: "devices", action: "turn device on or off", actionValues: [p["deviceName"], p["onOrOff"]] };
                  console.log('aiReaction', aiReaction);
                  aiReactionService.subject.next(aiReaction);
                }, 1000);
              });
            });
        }
      }),
    new AiAction("tweak thermostat", [
      new AiActionParameter("targetTemperature", "number", 'target temperature in celsius.')
    ], (p, injector) => {
      {
        inject(Router)
          .navigate(['apps', 'devices'])
          .then(x => {
            runInInjectionContext(injector, () => {
              const aiReactionService = inject(AiReactionService);
              setTimeout(() => {
                const aiReaction = { appName: "devices", action: "tweak thermostat", actionValues: [p["targetTemperature"]] };
                console.log('aiReaction', aiReaction);
                aiReactionService.subject.next(aiReaction);
              }, 1000);
            });
          });
      }
    }),
    new AiAction("dim lamp", [
      //Probably the description can be supplied dynamically
      new AiActionParameter("lampName", "string", 'the name of the lamp. One of: ["Ceiling lamp", "Floor lamp", "Night lamp", "Kitchen lamp"].'),
      new AiActionParameter("targetLevel", "number", 'target level of the light. Between 0 and 100. The bigger the brighter. only the number, without % or anything')
    ], (p, injector) => {
      {
        inject(Router)
          .navigate(['apps', 'devices'])
          .then(x => {
            runInInjectionContext(injector, () => {
              const aiReactionService = inject(AiReactionService);
              setTimeout(() => {
                const aiReaction = { appName: "devices", action: "dim lamp", actionValues: [p["lampName"], p["targetLevel"]] };
                aiReactionService.subject.next(aiReaction);
              }, 1000);
            });
          });
      }
    }),
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
