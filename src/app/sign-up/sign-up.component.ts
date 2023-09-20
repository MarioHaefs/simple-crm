import { Component, inject } from '@angular/core';
import { Auth, getAuth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';

interface FirebaseError {
  code: string;
  message: string;
}


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  private auth: Auth = inject(Auth);
  email!: string;
  password!: string;
  buttonContent: string = "Sign up";


  constructor(private router: Router) {}


  async signUp(email: string, password: string) {
    if (!email || !password) {
      this.buttonContent = "Please insert data!";

      setTimeout(() => {
        this.buttonContent = "Sign up";
        this.email = '';
        this.password = '';
      }, 1500);

      return;
    }

    this.buttonContent = "Sending...";
    
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      this.buttonContent = "Registration was successful!";
      setTimeout(() => {
        this.router.navigate(['']);
      }, 1500);
    } catch (error: unknown) {
      const firebaseError = error as FirebaseError;
      if (firebaseError.code === 'auth/invalid-email') {
        this.buttonContent = "Invalid Mailadress! Try again!";
      } else if (firebaseError.code === 'auth/email-already-in-use') {
        this.buttonContent = "Mail already used!";
      } else {
        this.buttonContent = "Sign up";
      }
    }

    setTimeout(() => {
      this.buttonContent = "Sign up";
      this.email = '';
      this.password = '';
  }, 2000);
  }

}