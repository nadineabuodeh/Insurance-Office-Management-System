import { Routes } from '@angular/router';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: '', component: SplashScreenComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: '' }
];