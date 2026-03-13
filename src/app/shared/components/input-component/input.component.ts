import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'inputfield',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class CustomInputComponent {
  @Input({ required: true }) control!: FormControl;
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() appearance: 'fill' | 'outline' = 'outline';

  get errorMessage(): string {
    if (this.control.hasError('required')) return 'This field is required';
    if (this.control.hasError('email')) return 'Invalid email format';
    if (this.control.hasError('minlength')) return 'Too short text';
    if (this.control.hasError('passwordMismatch')) return 'Passwords do not match';
    return 'Invalid input';
  }
}