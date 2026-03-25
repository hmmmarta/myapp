import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Task, TaskService } from '../../../core/services/task.service';

interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
  allDone: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  providers: [DatePipe],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  private taskService = inject(TaskService);
  
  viewDate = signal(new Date());
  selectedDate = signal<Date | null>(new Date());
  allTasks = signal<Task[]>([]);

  calendarDays = computed(() => {
    const current = this.viewDate();
    const year = current.getFullYear();
    const month = current.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const days: CalendarDay[] = [];

    const startDayOfWeek = firstDayOfMonth.getDay(); 

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push(this.createDay(new Date(year, month - 1, prevMonthLastDay - i), false));
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push(this.createDay(new Date(year, month, i), true));
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(this.createDay(new Date(year, month + 1, i), false));
    }

    return days;
  });

  tasksForSelectedDate = computed(() => {
    const selected = this.selectedDate();
    if (!selected) return [];
    const dateString = this.formatDate(selected);
    return this.allTasks().filter(t => t.dueDate === dateString);
  });

  ngOnInit() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      this.taskService.getTasksByUser(user.id).subscribe(tasks => {
        this.allTasks.set(tasks);
      });
    }
  }

  private createDay(date: Date, isCurrentMonth: boolean): CalendarDay {
    const dateString = this.formatDate(date);
    const dayTasks = this.allTasks().filter(t => t.dueDate === dateString);
    
    const today = new Date();
    const isToday = date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear();

    const isAllDone = dayTasks.length > 0 && dayTasks.every(t => t.status === 'done');

    return { 
      date, 
      dayNumber: date.getDate(), 
      isCurrentMonth, 
      isToday, 
      tasks: dayTasks, 
      allDone: isAllDone
    };
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  prevMonth() {
    this.viewDate.update(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  nextMonth() {
    this.viewDate.update(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  selectDay(day: CalendarDay) {
    this.selectedDate.set(day.date);
    if (!day.isCurrentMonth) {
      this.viewDate.set(day.date);
    }
  }
}