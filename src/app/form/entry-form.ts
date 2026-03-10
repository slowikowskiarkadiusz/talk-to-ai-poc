import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

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

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      greenhouse: [null, Validators.required],
      block: [null, Validators.required],
      plantHeight: [null, [Validators.required, Validators.min(0)]],
      stemWidth: [null, [Validators.required, Validators.min(0)]],
      leafWidth: [null, [Validators.required, Validators.min(0)]],
      bedDepth: [null, [Validators.required, Validators.min(0)]],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }

  onReset() {
    this.form.reset();
  }
}
