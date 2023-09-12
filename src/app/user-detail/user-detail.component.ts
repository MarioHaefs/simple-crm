import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { collection, addDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { User } from 'src/models/user.class';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditAddressComponent } from '../dialog-edit-address/dialog-edit-address.component';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';
import { onSnapshot } from 'firebase/firestore';
import { Router } from '@angular/router';



@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})


export class UserDetailComponent {
  firestore: Firestore = inject(Firestore);
  userId = '';
  user: User = new User();


  constructor(private route: ActivatedRoute, public dialog: MatDialog, private router: Router) {

    this.route.params.subscribe((params) => {    // <-- route und params sind Teil von ActivatedRoute. So kommt man an die ID
      this.userId = params['id'];

      this.getUser();
    });

  }


  /**
   * retrieves user data from the Firestore database based on the userId
   */
  getUser() {
    let userDoc = doc(this.firestore, 'users', this.userId);

    onSnapshot(userDoc, (docSnapshot) => {         // <-- onSnapshot aktualisiert Daten im Frontend in Echtzeit!
      if (docSnapshot.exists()) {
        this.user = new User(docSnapshot.data());
      }
    });
  }


  /**
   * opens DialogEditUserComponent for editing
   */
  editUserDetail() {
    const dialogUser = this.dialog.open(DialogEditUserComponent);
    dialogUser.componentInstance.user = new User(this.user.toJSON());  // <-- this "new User(this.user.toJSON());" erstellt eine Kopie unseres Nutzers
    dialogUser.componentInstance.userId = this.userId;
  }


  /**
   * opens DialogEditAddressComponent for editing
   */
  editMenu() {
    const dialogMenu = this.dialog.open(DialogEditAddressComponent);
    dialogMenu.componentInstance.user = new User(this.user.toJSON());
    dialogMenu.componentInstance.userId = this.userId;
  }


  async deleteUser() {
    const userDocRef = doc(this.firestore, 'users', this.userId);
    await deleteDoc(userDocRef);
    this.router.navigate(['/user']);
  }


}
