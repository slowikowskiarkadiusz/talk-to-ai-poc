import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Ollama } from '../ollama';

@Component({
  selector: 'app-ai-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: 'ai-dialog.html',
  styleUrl: 'ai-dialog.scss',
})
export class AiDialog implements OnDestroy {
  private dialogRef = inject(MatDialogRef<AiDialog>);

  isRecording = false;
  transcript = '';

  actions = [
    {
      icon: 'open_in_new',
      label: 'Navigate to app',
      examples: [
        'open plant growth',
        'go to settings',
        'show me the apps',
      ],
    },
    {
      icon: 'bar_chart',
      label: 'Summarize data',
      examples: [
        'show plant growth summary',
        'what was recorded this week?',
      ],
    },
    {
      icon: 'add_circle',
      label: 'Create new entry',
      examples: [
        'open form for creating a new plant growth entry',
        'i just inspected a plant at the first greenhouse and the second block. it\'s 2 centimeters high and i spotted some gray wall',
      ],
    },
  ];

  get titleLabel(): string {
    if (this.isRecording) return 'Recording…';
    return 'AI Assistant';
  }

  private recognition: any;
  private finalTranscript = '';

  constructor(private changeDetectorRef: ChangeDetectorRef, private ollama: Ollama) {
    // ollama.processAiActionRequest("my ceiling light is way too bright");

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
    this.dialogRef.close(this.transcript);
  }

  onClose(): void {
    this.stopRecording();
    this.dialogRef.close(null);
  }

  ngOnDestroy(): void {
    this.stopRecording();
  }
}
