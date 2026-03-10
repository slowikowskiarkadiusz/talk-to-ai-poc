import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SpeechDialog, SpeechDialogData } from '../speech-dialog/speech-dialog';
import { EntryFormData } from '../ollama';

@Component({
  selector: 'entry-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: 'entry-form.html',
  styleUrl: 'entry-form.scss',
})
export class EntryForm {
  greenhouses = ['Greenhouse 1', 'Greenhouse 2', 'Greenhouse 3'];
  blocks = ['Block 1', 'Block 2', 'Block 3', 'Block 4', 'Block 5', 'Block 6'];

  form: FormGroup;

  constructor(private fb: FormBuilder, private dialog: MatDialog) {
    this.form = this.fb.group({
      greenhouse: [null, Validators.required],
      block: [null, Validators.required],
      plantHeight: [null, [Validators.required, Validators.min(0)]],
      stemWidth: [null, [Validators.required, Validators.min(0)]],
      leafWidth: [null, [Validators.required, Validators.min(0)]],
      bedDepth: [null, [Validators.required, Validators.min(0)]],
    });
  }

  openSpeechDialog() {
    const data: SpeechDialogData = { greenhouses: this.greenhouses, blocks: this.blocks };
    const ref = this.dialog.open(SpeechDialog, { width: '480px', data });
    ref.afterClosed().subscribe((data: EntryFormData) => {
      console.log("Data", data);
      this.form.controls['greenhouse'].setValue(data.greenhouse);
      this.form.controls['block'].setValue(data.block);
      this.form.controls['plantHeight'].setValue(data.plantHeight);
      this.form.controls['stemWidth'].setValue(data.stemWidth);
      this.form.controls['leafWidth'].setValue(data.leafWidth);
      this.form.controls['bedDepth'].setValue(data.bedDepth);
    });
  }

  onSubmit() {
    if (this.form.valid) console.log(this.form.value);
  }

  onReset() {
    this.form.reset();
  }
}
