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
    { icon: 'home', label: 'Greenhouse and block' },
    { icon: 'height', label: 'Plant height' },
    { icon: 'linear_scale', label: 'Stem diameter' },
    { icon: 'nature', label: 'Leaf width' },
    { icon: 'vertical_align_bottom', label: 'Bed depth' },
  ];

  get titleLabel(): string {
    if (this.isLoading) return 'Processing…';
    if (this.isRecording) return 'Recording…';
    return 'Description';
  }

  private recognition: any;
  private silenceTimer: any;
  private finalTranscript = '';

  constructor(private ollama: Ollama, private changeDetectorRef: ChangeDetectorRef) {
    this.initRecognition();
    this.startRecording();
  }

  private initRecognition(): void {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      console.warn('SpeechRecognition not supported.');
      return;
    }

    this.recognition = new SR();
    this.recognition.lang = 'en-US';
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

  onFinish(): void {
    this.stopRecording();
    this.sendToServer();
  }

  private sendToServer(): void {
    if (!this.transcript) return;
    this.isLoading = true;
    this.changeDetectorRef.markForCheck();

    this.ollama.sendEntryFormPrompt(this.transcript, this.modalData.greenhouses, this.modalData.blocks)
      .then(x => { this.dialogRef.close(x) })
      .finally(() => this.isLoading = false);
  }

  onClose(): void {
    this.stopRecording();
    this.dialogRef.close(null);
  }

  ngOnDestroy(): void {
    this.stopRecording();
  }
}
