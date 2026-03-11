import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

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
  private http = inject(HttpClient);

  records: PlantEntry[] = [];
  loading = true;
  displayedColumns = ['createdAt', 'greenhouse', 'block', 'targetKind', 'plantHeight', 'stemWidth', 'leafWidth', 'bedDepth'];

  ngOnInit() {
    this.loadRecords();
  }

  loadRecords() {
    this.loading = true;
    this.http.get<PlantEntry[]>('/api/plantentries').subscribe({
      next: (data) => {
        this.records = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
