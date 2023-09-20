import { Component, inject } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  private auth: Auth = inject(Auth);
  showDropdown = false;


  constructor(private router: Router) { }


  /**
   * toggles display state of the dropdown menu
   * if the dropdown is currently shown, it hides it and if is currently hide, it shows it
   */
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }


  /**
   * logs the user out using firebase auth and navigates to log in
   */
  async logout() {
    await signOut(this.auth);
    this.router.navigate(['']);
  }

}
