import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { PlantEntriesDb } from '../plant-entries-db';

export interface PlantEntry {
  id: number;
  greenhouse: string;
  block: string;
  targetKind: string;
  plantHeight: number;
  stemWidth: number;
  leafWidth: number;
  bedDepth: number;
  createdAt: string;
}

@Component({
  selector: 'records-list',
  standalone: true,
  imports: [CommonModule, DatePipe, MatTableModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: 'records-list.html',
  styleUrl: 'records-list.scss',
})
export class RecordsList implements OnInit {
  private db = inject(PlantEntriesDb);

  records: PlantEntry[] = [];
  loading = true;
  displayedColumns = ['createdAt', 'greenhouse', 'block', 'targetKind', 'plantHeight', 'stemWidth', 'leafWidth', 'bedDepth'];

  ngOnInit() {
    this.loadRecords();
  }

  loadRecords() {
    this.loading = true;
    return new Promise((resolve, reject) => {
      this.db.getAll().then((data) => {
        this.records = data;
        this.loading = false;
        resolve(null);
      }).catch(() => {
        this.loading = false;
        reject();
      });
    });
  }
}
