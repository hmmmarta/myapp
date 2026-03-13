import { Component } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { CustomInputComponent } from "../../shared/components/input-component/input.component";
import { MatButtonModule } from "@angular/material/button";
import { AuthService } from "../../core/services/auth.service";
import { CustomButtonComponent } from "../../shared/components/button-component/button.component";

@Component({
  selector: 'forgotpassword',
  standalone: true,
  templateUrl: './forgotpassword.html',
  styleUrls: ['./forgotpassword.scss'],
  imports: [
    ReactiveFormsModule,
    CustomInputComponent,
    MatButtonModule,
    CustomButtonComponent,
    RouterLink
  ]
})
export class ForgotPasswordComponent {
  constructor(private authService: AuthService, private router: Router) {}

  forgotpasswordForm = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
      nonNullable: true
    }),
    confirmPassword: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true
    })
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
    if (this.forgotpasswordForm.valid) {
      const { email, password } = this.forgotpasswordForm.getRawValue();

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
      
    } else {
      this.forgotpasswordForm.markAllAsTouched();
    }
  }
}