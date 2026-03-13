import { Component } from "@angular/core";
import { CustomInputComponent } from "../../shared/components/input-component/input.component";
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService, User } from "../../core/services/auth.service";
import { CustomButtonComponent } from "../../shared/components/button-component/button.component";

@Component({
  selector: 'signup',
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss'],
  imports: [
    ReactiveFormsModule,
    CustomInputComponent,
    RouterLink,
    CustomButtonComponent
  ]
})
export class SignUpComponent {
  constructor(private authService: AuthService, private router: Router) {}

  registrationForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { 
    validators: this.passwordMatchValidator 
  });

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      const rawValues = this.registrationForm.getRawValue();
    
      const { confirmPassword, ...userData } = rawValues;
      this.authService.signUp(userData as User).subscribe({
        next: () => {
          alert('Registration successful!');
          this.router.navigate(['/login']);
        },
        error: (err) => console.error('Sign up error', err)
      });
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }
}