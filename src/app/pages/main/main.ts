import { Component, OnInit } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { Router } from "@angular/router";
import { BoardComponent } from "../../shared/components/board-component/board.component";

@Component({
  selector: 'main',
  templateUrl: './main.html',
  styleUrls: ['./main.scss'],
  imports: [
    MatMenuModule,
    MatIconModule,
    BoardComponent
  ]
})
export class MainComponent implements OnInit {
  userInitials: string = '';
  userName: string = '';
  constructor(private router: Router) {}

  ngOnInit() {
    const userJson = localStorage.getItem('user');
    
    if (userJson) {
      const user = JSON.parse(userJson);
      this.userName = user.name || user.email;
      this.userInitials = this.getInitials(this.userName);
    }
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