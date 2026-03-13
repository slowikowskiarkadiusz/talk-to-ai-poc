import { ChangeDetectorRef, Component, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { filter } from 'rxjs';
import { AiReactionService } from '../ai-reaction.service';
import { EntryForm } from '../entity-form/entry-form';
import { EntryFormData } from '../ollama';
import { RecordsList } from '../records-list/records-list';

@Component({
  selector: 'app-plant-growth',
  standalone: true,
  imports: [MatTabsModule, MatButtonModule, MatIconModule, RecordsList],
  templateUrl: './plant-growth.html',
  styleUrl: './plant-growth.scss',
})
export class PlantGrowthComponent {
  @ViewChild('recordsList') recordsList!: RecordsList;

  private dialog = inject(MatDialog);
  private changeDetector = inject(ChangeDetectorRef);

  constructor(aiReactionService: AiReactionService) {
    aiReactionService
      .subject
      .pipe(filter(x => x.appName == "plant growth"))
      .subscribe(x => {
        if (x.action == "create report") {
          this.openEntryForm(x.actionValues[0]);
        }
      })
  }

  openEntryForm(data?: EntryFormData) {
    console.log('openEntryForm', data);
    const ref = this.dialog.open(EntryForm, { width: '680px', data });
    ref.afterClosed().subscribe((saved) => {
      if (saved) this.recordsList.loadRecords().then(() => this.changeDetector.markForCheck());
    });
  }
}
