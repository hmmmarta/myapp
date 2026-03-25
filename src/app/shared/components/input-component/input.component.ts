import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormField } from '@angular/forms/signals'; 

@Component({
  selector: 'inputfield',
  standalone: true,
  imports: [CommonModule, FormField], 
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class CustomInputComponent {
  field = input.required<any>(); 
  isSubmitted = input<boolean>(false);
  
  label = input<string>('');
  placeholder = input<string>('');
  type = input<string>('text');

  get hasError(): boolean {
    const state = this.field()(); 
    
    return !state.valid() && (state.touched() || state.dirty() || this.isSubmitted());
  }

  get errorMessage(): string {
    const state = this.field()();
    const errors = state.errors();
    return errors && errors.length > 0 ? errors[0].message : '';
  }
}