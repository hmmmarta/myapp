import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'custom-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class CustomButtonComponent {
  @Input() text: string = 'Button'; 
  
  @Input() type: 'button' | 'submit' = 'button'; 
  
  @Input() btnClass: string = 'btn'; 

  @Input() isDisabled: boolean = false; 

  @Output() onClick = new EventEmitter<void>();
}