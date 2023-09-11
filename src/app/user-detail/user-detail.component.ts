import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { User } from 'src/models/user.class';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditAddressComponent } from '../dialog-edit-address/dialog-edit-address.component';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';


@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})


export class UserDetailComponent {
  firestore: Firestore = inject(Firestore);
  userId = '';
  user: User = new User();

  
  constructor(private route: ActivatedRoute, public dialog: MatDialog) {

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

    getDoc(userDoc).then((docSnapshot) => {

      this.user = docSnapshot.data() as User;

    });
  }


  /**
   * opens DialogEditUserComponent for editing
   */
  editUserDetail() {
    const dialogUser = this.dialog.open(DialogEditUserComponent);
    dialogUser.componentInstance.user = this.user;
  }


  /**
   * opens DialogEditAddressComponent for editing
   */
  editMenu() {
    const dialogMenu = this.dialog.open(DialogEditAddressComponent);
    dialogMenu.componentInstance.user = this.user;
  }

}
