import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  id?: string;
  title: string;
  status: 'todo' | 'inProgress' | 'needsChecking' | 'done';
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) {}

  getTasksByUser(userId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}?userId=${userId}`);
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${task.id}`, { status: task.status });
  }
  
  deleteTask(taskId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${taskId}`);
  }
}