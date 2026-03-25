import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Task } from '../../../core/services/task.service';

@Component({
  selector: 'task-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.scss'
})
export class TaskDialogComponent {
  dialogRef = inject(MatDialogRef<TaskDialogComponent>);

  data: Task = inject(MAT_DIALOG_DATA);

  cancel() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.data);
  }
}