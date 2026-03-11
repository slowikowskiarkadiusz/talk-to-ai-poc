import { Component, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { EntryForm } from './entity-form/entry-form';
import { RecordsList } from './records-list/records-list';

@Component({
  selector: 'app-root',
  imports: [MatTabsModule, MatButtonModule, MatIconModule, RecordsList],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  @ViewChild('recordsList') recordsList!: RecordsList;

  private dialog = inject(MatDialog);

  openEntryForm() {
    const ref = this.dialog.open(EntryForm, { width: '680px' });
    ref.afterClosed().subscribe((saved) => {
      if (saved) this.recordsList.loadRecords();
    });
  }
}
