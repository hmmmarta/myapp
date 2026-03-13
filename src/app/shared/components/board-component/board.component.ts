import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task, TaskService } from '../../../core/services/task.service';
import { forkJoin } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, MatIconModule]
})
export class BoardComponent implements OnInit {
  newTaskTitle: string = '';
  currentUserId: string = '';

  todo: Task[] = [];
  inProgress: Task[] = [];
  needsChecking: Task[] = [];
  done: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      this.currentUserId = user.id; 

      this.loadTasks();
    }
  }

  loadTasks() {
    this.taskService.getTasksByUser(this.currentUserId).subscribe(tasks => {
      this.todo = tasks.filter(t => t.status === 'todo');
      this.inProgress = tasks.filter(t => t.status === 'inProgress');
      this.needsChecking = tasks.filter(t => t.status === 'needsChecking');
      this.done = tasks.filter(t => t.status === 'done');
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
        this.todo.push(savedTask);
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

  deleteSingleTask(task: Task, currentList: Task[]) {
    if (!task.id) return;

    this.taskService.deleteTask(task.id).subscribe(() => {
      const index = currentList.indexOf(task);
      if (index >= 0) {
        currentList.splice(index, 1);
      }
    });
  }

  clearDoneTasks() {
    if (this.done.length === 0) return;

    const deleteRequests = this.done.map(task => this.taskService.deleteTask(task.id!));

    forkJoin(deleteRequests).subscribe(() => {
      this.done = []; 
    });
  }
}