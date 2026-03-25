import { Component, signal, inject, computed } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { form, required, email, minLength } from '@angular/forms/signals'; 
import { CustomInputComponent } from "../../shared/components/input-component/input.component";
import { AuthService } from "../../core/services/auth.service";
import { CustomButtonComponent } from "../../shared/components/button-component/button.component";
import { MatFormFieldModule } from "@angular/material/form-field";

@Component({
  selector: 'forgotpassword',
  standalone: true,
  templateUrl: './forgotpassword.html',
  styleUrls: ['./forgotpassword.scss'],
  imports: [
    CustomInputComponent,
    CustomButtonComponent,
    RouterLink,
    MatFormFieldModule
  ]
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  formSubmitted = signal(false);

  forgotModel = signal({
    email: '',
    password: '',
    confirmPassword: ''
  });

  passwordsMatch = computed(() => {
    const model = this.forgotModel();
    return model.password === model.confirmPassword;
  });

  forgotForm = form(this.forgotModel, (schema) => {
    required(schema.email, { message: 'This field is required' });
    email(schema.email, { message: 'Invalid email format' });

    required(schema.password, { message: 'This field is required' });
    minLength(schema.password, 6, { message: 'Too short (min 6 characters)' });

    required(schema.confirmPassword, { message: 'This field is required' });
  });

  onSubmit(event: Event) {
    event.preventDefault();
    
    this.formSubmitted.set(true);

    const isEmailValid = this.forgotForm.email().valid();
    const isPasswordValid = this.forgotForm.password().valid();
    const isConfirmValid = this.forgotForm.confirmPassword().valid();

    if (isEmailValid && isPasswordValid && isConfirmValid && this.passwordsMatch()) {
      const { email, password } = this.forgotModel();

      this.authService.changePassword(email, password).subscribe({
        next: (updatedUser) => {
          console.log('Password changed for:', updatedUser);
          alert('Password changed succesfully!');
          
          this.router.navigate(['/login']);
        },
        error: (err) => {
          alert(err.message);
        }
      });
    }
  }
}