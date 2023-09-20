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


  constructor(private router: Router) { }


  /**
   * sign up user with firebase auth
   * @param email - user mailaddress
   * @param password - user pw
   * @returns {void}
   */
  async signUp(email: string, password: string) {
    if (this.areInputsInvalid(email, password)) return;

    this.buttonContent = "Sending...";

    try {
      await this.attemptSignUp(email, password);
    } catch (error) {
      this.handleSignUpError(error);
    }

    this.resetAfterDelay();
  }


  /**
   * if input fields are empty error message is shown
   * @param email - user mailaddress
   * @param password - user pw
   * @returns {boolean}
   */
  private areInputsInvalid(email: string, password: string): boolean {
    if (!email || !password) {
      this.buttonContent = "Please insert data!";
      this.resetAfterDelay(1500);
      return true;
    }
    return false;
  }


  /**
   * if registration was successful: shows message -> create user on firebase auth -> navigate to login component
   * @param email - user mailaddress
   * @param password - user pw
   */
  private async attemptSignUp(email: string, password: string) {
    const result = await createUserWithEmailAndPassword(this.auth, email, password);
    this.buttonContent = "Registration was successful!";
    setTimeout(() => {
      this.router.navigate(['']);
    }, 1500);
  }


  /**
   * if registration fails show individual error message
   * @param error 
   */
  private handleSignUpError(error: unknown) {
    const firebaseError = error as FirebaseError;
    if (firebaseError.code === 'auth/invalid-email') {
      this.buttonContent = "Invalid Mailadress!";
    } else if (firebaseError.code === 'auth/email-already-in-use') {
      this.buttonContent = "Mail already used!";
    } else {
      this.buttonContent = "Sign up";
    }
  }


  /**
   * resets input field and button innerHTML after 2 sec
   * @param delay -setTimeout time
   */
  private resetAfterDelay(delay: number = 2000) {
    setTimeout(() => {
      this.buttonContent = "Sign up";
      this.email = '';
      this.password = '';
    }, delay);
  }

}