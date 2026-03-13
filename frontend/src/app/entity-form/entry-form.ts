import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PlantEntriesDb } from '../plant-entries-db';
import { EntryFormData } from '../ollama';
import { PlantGrowthSpeechDialog, PlantGrowthSpeechDialogData } from '../plant-growth-speech-dialog/plant-growth-speech-dialog';

export const targetKindDictionary: { [p: string]: string[] } = {
  "Pests": [
    "Aphid",
    "Bronze mite",
    "Fruit weevil",
    "Fruit worm",
    "Leaf mier",
    "Mealybug",
    "Nematodes",
    "Tuta absoluta",
    "White mite",
    "Whitefly",
    "Other",
  ],
  "Diseases": [
    "Botrytis",
    "Cladosporium",
    "Clavibacter",
    "Damping off",
    "Early blight",
    "Erwinia",
    "Fusarium",
    "Fusarium oxysporum",
    "Stemphylium",
    "Torrado virus",
    "Verticilium",
    "Xanthomonas campestris",
    "Yellow leaf curl virus",
    "Other",
  ],
  "Disorders": [
    "Biscuit fruits",
    "Bl Blossom end rot",
    "Blind plants",
    "Blossom end rot",
    "Blotchy",
    "Cat face",
    "Cracking",
    "Fruit nipple",
    "Gray wall",
    "Hollow fruits",
    "Internal fruit rot",
    "Micro cracking",
    "Other",
  ],
};

function getTargetKinds(): string[] {
  return Object.values(targetKindDictionary).flatMap(x => x);
}

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
  private dialogRef = inject(MatDialogRef<EntryForm>);
  private db = inject(PlantEntriesDb);

  greenhouses = ['Greenhouse 1', 'Greenhouse 2', 'Greenhouse 3'];
  blocks = ['Block 1', 'Block 2', 'Block 3', 'Block 4', 'Block 5', 'Block 6'];
  targets = Object.keys(targetKindDictionary);
  targetKinds: string[] = [];

  form: FormGroup;

  sparkles: { left: string, size: string, delay: string }[] = [
    // { left: '8%', size: '12px', delay: '0s' },
    // { left: '22%', size: '16px', delay: '0.5s' },
    // { left: '40%', size: '10px', delay: '1s' },
    // { left: '58%', size: '14px', delay: '1.5s' },
    // { left: '75%', size: '11px', delay: '0.3s' },
    // { left: '90%', size: '13px', delay: '1.8s' },
  ];

  constructor(private fb: FormBuilder, private dialog: MatDialog) {
    this.form = this.fb.group({
      greenhouse: [null, Validators.required],
      block: [null, Validators.required],
      target: [null, Validators.required],
      targetKind: [null, Validators.required],
      plantHeight: [null, [Validators.required, Validators.min(0)]],
      stemWidth: [null, [Validators.required, Validators.min(0)]],
      leafWidth: [null, [Validators.required, Validators.min(0)]],
      bedDepth: [null, [Validators.required, Validators.min(0)]],
    });

    this.form.controls['target'].valueChanges.subscribe(x => this.targetKinds = targetKindDictionary[x]);
  }

  openSpeechDialog() {
    const data: PlantGrowthSpeechDialogData = { greenhouses: this.greenhouses, blocks: this.blocks, targetKinds: getTargetKinds() };
    const ref = this.dialog.open(PlantGrowthSpeechDialog, { width: '480px', data });
    ref.afterClosed().subscribe((data: EntryFormData) => {
      console.log("data", data);
      if (!data)
        return;
      for (let controlName of Object.keys(this.form.controls)) {
        //@ts-ignore
        const newControlData = data[controlName];
        if (newControlData != null && newControlData != "")
          this.form.controls[controlName].setValue(newControlData);
      }

      if (data.targetKind)
        this.form.controls['target'].setValue(Object.keys(targetKindDictionary).filter(x => targetKindDictionary[x].includes(data.targetKind))[0]);
    });
  }

  onSubmit() {
    if (!this.form.valid) return;
    const { target, ...payload } = this.form.value;
    this.db.add(payload).then(() => this.dialogRef.close(true));
  }

  onReset() {
    this.form.reset();
  }
}
