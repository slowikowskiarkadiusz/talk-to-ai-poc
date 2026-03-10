import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Ollama } from '../ollama';

export interface SpeechDialogData {
  greenhouses: string[],
  blocks: string[],
}

// ── DIALOG COMPONENT ──────────────────────────────────────────────
@Component({
  selector: 'app-speech-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    FormsModule,
  ],
  templateUrl: 'speech-dialog.html',
  styleUrl: 'speech-dialog.scss',
})
export class SpeechDialog implements OnDestroy {
  private dialogRef = inject(MatDialogRef<SpeechDialog>);
  private modalData: SpeechDialogData = inject(MAT_DIALOG_DATA);

  isRecording = false;
  isLoading = false;
  transcript = '';

  hints = [
    { icon: 'home', label: 'Szklarnia i blok' },
    { icon: 'height', label: 'Wysokość rośliny' },
    { icon: 'linear_scale', label: 'Szerokość łodygi' },
    { icon: 'nature', label: 'Szerokość liścia' },
    { icon: 'vertical_align_bottom', label: 'Głębokość w grzędzie' },
  ];

  get titleLabel(): string {
    if (this.isLoading) return 'Przetwarzanie…';
    if (this.isRecording) return 'Nagrywanie…';
    return 'Opis głosowy';
  }

  private recognition: any;
  private silenceTimer: any;
  private finalTranscript = '';

  constructor(private ollama: Ollama, private changeDetectorRef: ChangeDetectorRef) {
    this.initRecognition();
    this.startRecording();
  }

  // ── SPEECH RECOGNITION SETUP ──────────────────────────────────────

  private initRecognition(): void {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      console.warn('SpeechRecognition nie jest wspierane w tej przeglądarce.');
      return;
    }

    this.recognition = new SR();
    this.recognition.lang = 'pl-PL';
    this.recognition.continuous = true;
    this.recognition.interimResults = true;

    this.recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          this.finalTranscript += result[0].transcript + ' ';
        } else {
          interim += result[0].transcript;
        }
      }
      this.transcript = (this.finalTranscript + interim).trim();
      this.changeDetectorRef.markForCheck();
    };

    this.recognition.onerror = (event: any) => {
      console.error('SpeechRecognition error:', event.error);
      this.isRecording = false;
    };

    this.recognition.onend = () => {
      this.isRecording = false;
    };
  }

  private startRecording(): void {
    if (!this.recognition) return;
    this.finalTranscript = '';
    this.transcript = '';
    this.isRecording = true;
    this.recognition.start();
  }

  private stopRecording(): void {
    if (!this.recognition) return;
    this.isRecording = false;
    this.recognition.stop();
  }

  // ── FINISH BUTTON ─────────────────────────────────────────────────

  onFinish(): void {
    this.stopRecording();
    this.sendToServer();
  }

  // ── SERVER CALL ───────────────────────────────────────────────────

  private sendToServer(): void {
    if (!this.transcript) return;
    this.isLoading = true;
    console.log('this.isLoading', this.isLoading);
    this.changeDetectorRef.markForCheck();

    this.ollama.sendEntryFormPrompt(this.transcript, this.modalData.greenhouses, this.modalData.blocks)
      .then(x => { this.dialogRef.close(x) })
      .finally(() => this.isLoading = false);
  }

  // ── CLOSE ─────────────────────────────────────────────────────────

  onClose(): void {
    this.stopRecording();
    this.dialogRef.close(null);
  }

  ngOnDestroy(): void {
    this.stopRecording();
  }
}
