import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { AiDialog } from './ai-dialog/ai-dialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatRippleModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private dialog = inject(MatDialog);

  openAiDialog(): void {
    this.dialog.open(AiDialog, { width: '480px' });
  }
}
