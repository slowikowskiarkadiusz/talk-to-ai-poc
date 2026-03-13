import { inject, runInInjectionContext } from "@angular/core";
import { Router } from "@angular/router";
import { AiReactionService } from "../ai-reaction.service";
import { blocks, getTargetKinds, greenhouses } from "../entity-form/entry-form";
import { AiAction, AiActionParameter, AiProcessor } from "./ai-processor";

export const plantGrowthAiProcessor = new AiProcessor(
  "plant growth",
  [
    new AiAction("create report", [
      new AiActionParameter("greenhouse", "string", `one of: [ ${greenhouses.join(", ")} ]`),
      new AiActionParameter("block", "string", `one of: [ ${blocks.join(", ")} ]`),
      new AiActionParameter("targetKind", "string", `one of: [ ${getTargetKinds().join(", ")} ]`),
      new AiActionParameter("plantHeight", "string", "value in centimeters"),
      new AiActionParameter("stemWidth", "string", "value in centimeters"),
      new AiActionParameter("leafWidth", "string", "value in centimeters"),
      new AiActionParameter("bedDepth", "string", "value in centimeters"),
    ], (p, injector) => {
      inject(Router).navigate(['apps', 'plant-growth']).then(() => {
        runInInjectionContext(injector, () => {
          const aiReactionService = inject(AiReactionService);
          aiReactionService.subject.next({ appName: 'plant growth', action: 'create report', actionValues: [p] })
        })
      })
    }),
    new AiAction("show chart", [
      new AiActionParameter("property", "string", "the name of the property to show on the chart. one of: [ PlantHeight, StemWidth, LeafWidth, BedDepth]")],
      p => { inject(Router).navigate(['apps', 'plant-growth']) }
    )
  ],
  [
    ["Show me crop data", "plant growth", "show chart"],
    ["I need a field report", "plant growth", "create report"]
  ]
);
