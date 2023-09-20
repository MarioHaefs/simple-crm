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


  /**
   * anonymous guest log in from firebase auth
   */
  async guestLogIn() {
    await signInAnonymously(this.auth);
    this.router.navigate(['/dashboard']);
  }


  /**
   * log in user with firebase auth
   * @param email - user mailaddress
   * @param password - user pw
   * @returns {void}
   */
  async login(email: string, password: string) {
    if (this.areInputsInvalid(email, password)) return;
    this.loginButtonContent = "Sending...";
    try {
      await this.attemptLogin(email, password);
    } catch (error) {
      this.handleLoginError(error);
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
      this.loginButtonContent = "Please insert data!";
      this.resetAfterDelay(1500);
      return true;
    }
    return false;
  }


  /**
   * if log in was successful: shows message -> logs user in  -> navigate to dashboard component
   * @param email - user mailaddress
   * @param password - user pw
   * @returns {void}
   */
  private async attemptLogin(email: string, password: string) {
    const result = await signInWithEmailAndPassword(this.auth, email, password);
    this.loginButtonContent = "Log in successful!";
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 1500);
  }


  /**
   * if log in fails show individual error message
   * @param error
   * @returns {void}
   */
  private handleLoginError(error: unknown) {
    const firebaseError = error as FirebaseError;
    if (firebaseError.code === 'auth/invalid-email') {
      this.loginButtonContent = "Invalid Mailadress! Try again!";
    } else if (firebaseError.code === 'auth/invalid-login-credentials') {
      this.loginButtonContent = "Invalid login data!";
    } else {
      this.loginButtonContent = "Log in";
    }
  }


  /**
   * resets input field and button innerHTML after 2 sec
   * @param delay -setTimeout time
   * @returns {void}
   */
  private resetAfterDelay(delay: number = 2500) {
    setTimeout(() => {
      this.loginButtonContent = "Log in";
      this.email = '';
      this.password = '';
    }, delay);
  }

}
