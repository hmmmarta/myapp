import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { SignUpComponent } from './pages/signup/signup';
import { LogInComponent } from './pages/login/login';
import { MainComponent } from './pages/main/main';
import { ForgotPasswordComponent } from './pages/forgotpassword/forgotpassword';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {path: 'signup', component: SignUpComponent},
  {path: 'login', component: LogInComponent},
  {path: 'forgotpassword', component: ForgotPasswordComponent},
  {path: 'main', component: MainComponent},
];
