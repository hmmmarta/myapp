import { Component, OnInit, signal, computed, inject } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { Router } from "@angular/router";
import { BoardComponent } from "../../shared/components/board-component/board.component";
import { CalendarComponent } from "../../shared/components/calendar-component/calendar.component";

@Component({
  selector: 'main',
  standalone: true,
  templateUrl: './main.html',
  styleUrls: ['./main.scss'],
  imports: [
    MatMenuModule,
    MatIconModule,
    BoardComponent,
    CalendarComponent
  ]
})
export class MainComponent implements OnInit {
  private router = inject(Router);

  userName = signal<string>('');

  userInitials = computed(() => this.getInitials(this.userName()));

  activeTab = signal<'board' | 'calendar'>('board');

  ngOnInit() {
    const userJson = localStorage.getItem('user');
    
    if (userJson) {
      const user = JSON.parse(userJson);
      this.userName.set(user.name || user.email || '');
    }
  }

  setTab(tabName: 'board' | 'calendar') {
    this.activeTab.set(tabName);
  }

  getInitials(nameString: string): string {
    if (!nameString) return 'U';

    if (nameString.includes('@')) {
      return nameString.charAt(0).toUpperCase();
    }

    const parts = nameString.split(' ');
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    } else {
      return nameString.substring(0, 2).toUpperCase();
    }
  }

  logout() {
    localStorage.removeItem('user'); 
    this.router.navigate(['/home']);
  }
}