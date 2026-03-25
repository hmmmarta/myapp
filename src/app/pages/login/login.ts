import { Component, OnInit, signal, inject } from "@angular/core";
import { form, required, email, minLength } from '@angular/forms/signals'; 
import { CustomInputComponent } from "../../shared/components/input-component/input.component";
import { MatCheckboxModule, MatCheckboxChange } from "@angular/material/checkbox";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { MatButtonModule } from "@angular/material/button";
import { CustomButtonComponent } from "../../shared/components/button-component/button.component";

interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

@Component({
  selector: 'login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [
    CustomInputComponent,
    MatCheckboxModule,
    RouterLink,
    MatButtonModule,
    CustomButtonComponent
  ]
})
export class LogInComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  loginModel = signal<LoginData>({
    email: '',
    password: '',
    rememberMe: false
  });

  loginForm = form(this.loginModel, (schema) => {
    required(schema.email, { message: 'This field is required' });
    email(schema.email, { message: 'Invalid email format' });

    required(schema.password, { message: 'This field is required' });
    minLength(schema.password, 6, { message: 'Too short text (min 6 characters)' });
  });

  formSubmitted = signal(false);

  ngOnInit() {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      this.loginModel.update(data => ({
        ...data,
        email: savedEmail,
        rememberMe: true
      }));
    }
  }

  toggleRememberMe(event: MatCheckboxChange) {
    this.loginModel.update(data => ({
      ...data,
      rememberMe: event.checked
    }));
  }

  onSubmit(event: Event) {
    event.preventDefault();

    this.formSubmitted.set(true);

    const isEmailValid = this.loginForm.email().valid();
    const isPasswordValid = this.loginForm.password().valid();

    if (isEmailValid && isPasswordValid) {
      const currentData = this.loginModel();
      this.authService.logIn(currentData.email, currentData.password).subscribe({
        next: (user) => {
          if (currentData.rememberMe) {
            localStorage.setItem('rememberedEmail', currentData.email);
          } else {
            localStorage.removeItem('rememberedEmail');
          }
          localStorage.setItem('user', JSON.stringify(user));
          this.router.navigate(['/main']);
        },
        error: (err) => {
          alert(err.message);
        }
      });
    }
  }
}