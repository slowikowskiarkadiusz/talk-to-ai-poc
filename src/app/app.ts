import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EntryForm } from './form/entry-form';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, EntryForm],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('talk-to-ai-poc');
}
