import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CustomInputComponent } from "../../shared/components/input-component/input.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { MatButtonModule } from "@angular/material/button";
import { CustomButtonComponent } from "../../shared/components/button-component/button.component";

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [
    ReactiveFormsModule,
    CustomInputComponent,
    MatCheckboxModule,
    RouterLink,
    MatButtonModule,
    CustomButtonComponent
  ]
})
export class LogInComponent implements OnInit{
  constructor(private authService: AuthService, private router: Router) {}
  loginForm = new FormGroup({
  email: new FormControl('', { 
    validators: [Validators.required, Validators.email], 
    nonNullable: true 
  }),
  password: new FormControl('', { 
    validators: [Validators.required, Validators.minLength(6)], 
    nonNullable: true 
  }),
  rememberMe: new FormControl(false, { nonNullable: true })
});
  ngOnInit() {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      this.loginForm.patchValue({
        email: savedEmail,
        rememberMe: true
      });
    }
  }
  onSubmit() {
  if (this.loginForm.valid) {
    const { email, password, rememberMe } = this.loginForm.getRawValue();

    this.authService.logIn(email, password).subscribe({
      next: (user) => {
        if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
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