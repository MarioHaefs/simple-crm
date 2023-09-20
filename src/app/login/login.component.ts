import { Component, inject } from '@angular/core';
import { Auth, getAuth, signInWithEmailAndPassword } from '@angular/fire/auth';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})


export class LoginComponent {

  email!: string;
  password!: string;
  private auth: Auth = inject(Auth);

  async login(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('Login erfolgreich');
    } catch (error) {
      console.error('Login nicht erfolgreich');
    }
  }
}
