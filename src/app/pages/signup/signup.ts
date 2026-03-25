import { Component, signal, inject, computed } from "@angular/core";
import { form, required, email, minLength } from '@angular/forms/signals'; 
import { Router, RouterLink } from "@angular/router";
import { AuthService, User } from "../../core/services/auth.service";
import { CustomInputComponent } from "../../shared/components/input-component/input.component";
import { CustomButtonComponent } from "../../shared/components/button-component/button.component";
import { MatFormFieldModule } from "@angular/material/form-field";

@Component({
  selector: 'signup',
  standalone: true,
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss'],
  imports: [
    CustomInputComponent,
    RouterLink,
    CustomButtonComponent,
    MatFormFieldModule
  ]
})
export class SignUpComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  formSubmitted = signal(false);

  registrationModel = signal({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  passwordsMatch = computed(() => {
    const model = this.registrationModel();
    return model.password === model.confirmPassword;
  });

  registrationForm = form(this.registrationModel, (schema) => {
    required(schema.name, { message: 'This field is required' });
    minLength(schema.name, 2, { message: 'Too short (min 2 characters)' });

    required(schema.email, { message: 'This field is required' });
    email(schema.email, { message: 'Invalid email format' });

    required(schema.password, { message: 'This field is required' });
    minLength(schema.password, 6, { message: 'Too short (min 6 characters)' });

    required(schema.confirmPassword, { message: 'This field is required' });
  });

  onSubmit(event: Event) {
    event.preventDefault(); 
    
    this.formSubmitted.set(true);

    const isNameValid = this.registrationForm.name().valid();
    const isEmailValid = this.registrationForm.email().valid();
    const isPasswordValid = this.registrationForm.password().valid();
    const isConfirmValid = this.registrationForm.confirmPassword().valid();

    if (isNameValid && isEmailValid && isPasswordValid && isConfirmValid && this.passwordsMatch()) {
      const rawValues = this.registrationModel();
      const { confirmPassword, ...userData } = rawValues;

      this.authService.signUp(userData as User).subscribe({
        next: () => {
          alert('Registration successful!');
          this.router.navigate(['/login']);
        },
        error: (err) => console.error('Sign up error', err)
      });
    }
  }
}