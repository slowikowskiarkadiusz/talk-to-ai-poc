import { Injectable } from '@angular/core';

export interface EntryFormData {  greenhouse: string,  block: string,  plantHeight: number,  stemWidth: number,  leafWidth: number,  bedDepth: number,}


@Injectable({
  providedIn: 'root',
})
export class Ollama {
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

  public async sendEntryFormPrompt(transcript: string, greenhouses: string[], blocks: string[]): Promise<EntryFormData> {
    console.log("transcript", transcript)
    const prompt = `Return only valid JSON, no explanation.
    JSON schema to fill: {  greenhouse: "",  block: "",  plantHeight: "",  stemWidth: "",  leafWidth: "",  bedDepth: "" }
    Greenhouse is one of: [ ${greenhouses.map(x => `"${x}"`).join(", ")} ]
    Block is one of: [ ${blocks.map(x => `"${x}"`).join(", ")} ]
    PlantHeight is a number in centimeters.
    StemWidth is a number in centimeters.
    LeafWidth is a number in centimeters.
    BedDepth is a number in meters.
    If you must, recalculate the values to centimeters.
    Don't fill out properties that you are not sure about.
    User input: "${transcript}"
    Return only valid parsable JSON: `;
    const result = await this.sendPrompt(prompt);
    const match = result.match(/\{[\s\S]*\}/);
    return JSON.parse(match![0]);
  }
}
