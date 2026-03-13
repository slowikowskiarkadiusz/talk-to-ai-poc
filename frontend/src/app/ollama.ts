import { Injectable, Injector, runInInjectionContext } from '@angular/core';
import { AiAction } from './ai-processors/ai-processor';
import { aiProcessors } from './ai-processors/list';

export interface EntryFormData {
  greenhouse: string,
  block: string,
  targetKind: string,
  plantHeight: number,
  stemWidth: number,
  leafWidth: number,
  bedDepth: number,
}

@Injectable({
  providedIn: 'root',
})
export class Ollama {
  constructor(private injector: Injector) { }

  public async sendPrompt(prompt: string): Promise<string> {
    const response = await fetch('/ollama/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2:3b',
        stream: false,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    const data = await response.json();
    console.log(data);
    return data.message.content;
  }

  public async processAiActionRequest(transcript: string) {
    const firstResult = await this.sendOverviewPrompt(transcript);
    console.log("firstResult", firstResult);
    const aiProcessor = aiProcessors.filter(x => x.appName == firstResult[0])[0];
    const aiAction = aiProcessor.actions.filter(x => x.name == firstResult[1])[0];
    const secondResult = aiAction.parameters.length > 0 ? await this.sendActionPrompt(transcript, aiAction) : {};
    runInInjectionContext(this.injector, () => aiAction.func(secondResult, this.injector));
  }

  private async sendOverviewPrompt(transcript: string): Promise<[string, string]> {
    console.log("transcript", transcript)
    const prompt = `You can open one of the apps: ${aiProcessors.map(x => `${x.appName}`).join(", ")}.
      ${aiProcessors.map(x => `In ${x.appName} your actions are: [${x.actions.map(x => `"${x.name}"`).join(", ")}].`)}

    Examples:
    ${aiProcessors.map(x => `"${x.examples[0]}" -> "${x.examples[1]}, ${x.examples[2]}"`)}

    The user has requested: "${transcript}".

    Return ONLY: "AppName, ActionName". No explanation, no other text or quotes or anything. Just letters and a comma.`;
    console.log("prompt", prompt);
    let result = await this.sendPrompt(prompt);
    console.log("result", result);
    if (result[0] == '"')
      result = result.substring(1);
    if (result[result.length - 1] == '"')
      result = result.substring(0, result.length - 1);
    const split = result.split(',');
    return [split[0].trim().toLowerCase(), split[1].trim().toLowerCase()];
  }

  private async sendActionPrompt(transcript: string, action: AiAction): Promise<{ [p: string]: string }> {
    const prompt = `Return only valid JSON, no explanation.
    JSON schema to fill: { ${action.parameters.map(x => `"${x.name}": ""`)} }
    ${action.parameters.map(x => `${x.name}: ${x.description}`)}
    User said: "${transcript}"
    Deduce proper values for the JSON parameters.
    Return only valid parsable JSON: `;
    console.log("prompt", prompt);
    const result = await this.sendPrompt(prompt);
    console.log("result", result);
    const match = result.match(/\{[\s\S]*\}/);
    return JSON.parse(match![0]);
  }

  public async sendEntryFormPrompt(transcript: string, greenhouses: string[], blocks: string[], targetKinds: string[]): Promise<EntryFormData> {
    console.log("transcript", transcript)
    const prompt = `Return only valid JSON, no explanation.
    JSON schema to fill: {  greenhouse: "",  block: "",  targetKind: "",  plantHeight: "",  stemWidth: "",  leafWidth: "",  bedDepth: "" }
    Greenhouse is one of: [ ${greenhouses.map(x => `"${x}"`).join(", ")} ]
    Block is one of: [ ${blocks.map(x => `"${x}"`).join(", ")} ]
    TargetKind is one of: [ ${targetKinds.map(x => `"${x}"`).join(", ")} ],
    PlantHeight is a number in centimeters.
    StemWidth is a number in centimeters.
    LeafWidth is a number in centimeters.
    BedDepth is a number in centimeters.
    Don't fill out properties that you are not sure about, the default (empty) value for each property is an empty string "".
    User input: "${transcript}"
    Return only valid parsable JSON: `;
    console.log("prompt", prompt);
    const result = await this.sendPrompt(prompt);
    const match = result.match(/\{[\s\S]*\}/);
    return JSON.parse(match![0]);
  }
}
