import { Component, inject } from '@angular/core';
import { Auth, getAuth, signInWithEmailAndPassword, signInAnonymously } from '@angular/fire/auth';
import { Router } from '@angular/router';


interface FirebaseError {
  code: string;
  message: string;
}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})


export class LoginComponent {
  private auth: Auth = inject(Auth);
  email!: string;
  password!: string;
  loginButtonContent: string = "Log in";


  constructor(private router: Router) { }


  async guestLogIn() {
    await signInAnonymously(this.auth);
    this.router.navigate(['/dashboard']);
  }


  async login(email: string, password: string) {
    if (!email || !password) {
      this.loginButtonContent = "Please insert data!";

      setTimeout(() => {
        this.loginButtonContent = "Log in";
        this.email = '';
        this.password = '';
      }, 1500);

      return;
    }

    this.loginButtonContent = "Sending...";

    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      this.loginButtonContent = "Log in successful!";
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500);
    } catch (error: unknown) {
      const firebaseError = error as FirebaseError;
      if (firebaseError.code === 'auth/invalid-email') {
        this.loginButtonContent = "Invalid Mailadress! Try again!";
      } else if (firebaseError.code === 'auth/invalid-login-credentials') {
        this.loginButtonContent = "Invalid login data!";
      } else {
        this.loginButtonContent = "Log in";
      }
    }

    setTimeout(() => {
      this.loginButtonContent = "Log in";
      this.email = '';
      this.password = '';
    }, 2500);
  }

}
