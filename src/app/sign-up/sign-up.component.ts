import { Component, inject } from '@angular/core';
import { Auth, getAuth, createUserWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {

  name!: string;
  email!: string;
  password!: string;
  private auth: Auth = inject(Auth);


  async signUp(email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      console.log('User signed up:', result);
    } catch (error) {
      console.error('Error during sign up:', error);
    }
  }
}
