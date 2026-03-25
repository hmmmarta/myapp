import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task, TaskService } from '../../../core/services/task.service';
import { forkJoin } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskDialogComponent } from '../task-component/task-dialog.component';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, MatIconModule, MatDialogModule]
})
export class BoardComponent implements OnInit {
  newTaskTitle: string = '';
  currentUserId: string = '';

  todo = signal<Task[]>([]);
  inProgress = signal<Task[]>([]);
  needsChecking = signal<Task[]>([]);
  done = signal<Task[]>([]);

  private taskService = inject(TaskService);
  private dialog = inject(MatDialog);

  ngOnInit() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      this.currentUserId = user.id; 
      this.loadTasks();
    }
  }

  private sortTasksByDueDate(tasks: Task[]): Task[] {
    return tasks.sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }

  loadTasks() {
    this.taskService.getTasksByUser(this.currentUserId).subscribe(tasks => {
      this.todo.set(this.sortTasksByDueDate(tasks.filter(t => t.status === 'todo')));
      this.inProgress.set(this.sortTasksByDueDate(tasks.filter(t => t.status === 'inProgress')));
      this.needsChecking.set(this.sortTasksByDueDate(tasks.filter(t => t.status === 'needsChecking')));
      this.done.set(this.sortTasksByDueDate(tasks.filter(t => t.status === 'done')));
    });
  }

  addTask() {
    if (this.newTaskTitle.trim() && this.currentUserId) {
      const newTask: Task = {
        title: this.newTaskTitle.trim(),
        status: 'todo',
        userId: this.currentUserId
      };

      this.taskService.addTask(newTask).subscribe(savedTask => {
        this.todo.update(tasks => this.sortTasksByDueDate([...tasks, savedTask]));
        this.newTaskTitle = '';
      });
    }
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      const movedTask = event.container.data[event.currentIndex];
      const newStatus = event.container.id as Task['status'];
      movedTask.status = newStatus;

      this.taskService.updateTask(movedTask).subscribe({
        error: (err) => console.error('Error with status:', err)
      });
    }
  }

  openTaskDetails(task: Task) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '550px',
      data: { ...task },
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe((updatedTask: Task) => {
      if (updatedTask) {
        this.taskService.updateTask(updatedTask).subscribe(() => {
          this.updateTaskInSignals(updatedTask);
        });
      }
    });
  }

  private updateTaskInSignals(updatedTask: Task) {
    const updateFn = (tasks: Task[]) => {
      const updatedList = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
      return this.sortTasksByDueDate(updatedList);
    };
    
    if (updatedTask.status === 'todo') this.todo.update(updateFn);
    else if (updatedTask.status === 'inProgress') this.inProgress.update(updateFn);
    else if (updatedTask.status === 'needsChecking') this.needsChecking.update(updateFn);
    else if (updatedTask.status === 'done') this.done.update(updateFn);
  }

  deleteSingleTask(task: Task, currentList: Task[], event: Event) {
    event.stopPropagation();

    if (!task.id) return;

    this.taskService.deleteTask(task.id).subscribe(() => {
      const index = currentList.indexOf(task);
      if (index >= 0) {
        currentList.splice(index, 1);
      }
    });
  }

  clearDoneTasks() {
    if (this.done().length === 0) return;

    const deleteRequests = this.done().map(task => this.taskService.deleteTask(task.id!));

    forkJoin(deleteRequests).subscribe(() => {
      this.done.set([]); 
    });
  }
}