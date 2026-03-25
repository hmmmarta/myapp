import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'custom-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class CustomButtonComponent {
  text = input<string>('Button'); 
  type = input<'button' | 'submit'>('button'); 
  btnClass = input<string>('btn'); 
  isDisabled = input<boolean>(false); 
  
  onClick = output<void>();
}