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


  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }


  async logout() {
    await signOut(this.auth);
    this.router.navigate(['']);
  }

}
