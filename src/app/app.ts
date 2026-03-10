import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EntryForm } from './form/entry-form';
import { Ollama } from './ollama';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, EntryForm],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('talk-to-ai-poc');

  constructor(ollama: Ollama) {
    const prompt = `Return only valid JSON, no explanation.
 JSON schema to fill: { greehouse: "", block: "", row: "", metersInsideRow: "", numberOfPlant: "", plantHeightCm: "", stemDiameterCm: "" }
 Greenhouse is one of: ['Home', "Almeria", "Greenhouse 1", "Greenhouse 2", "Greenhouse 3", "Greenhouse 4"]
 Block is one of: ["Block 1", "Block 2", "Block 3"]
 Row is a number.
 MetersInsideRow is a number.
 NumberOfPlant is a number.
 PlantHeightCm is a number.
 StemDiameterCm is a number.
 User input: "I am at home I am inspecting the first block. The plant number is 10 and it is 20 cm high while it's stem is 40 cm wide."
 JSON:
`
    ollama.sendPrompt(prompt).then(x => { console.log(x) });
  }
}
