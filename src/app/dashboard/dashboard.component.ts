import { Component, inject } from '@angular/core';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { collection, addDoc, doc, getDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { User } from 'src/models/user.class';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  firestore: Firestore = inject(Firestore);
  user: User = new User();
  userId = '';


  constructor(private route: ActivatedRoute, public dialog: MatDialog, private router: Router) {

    // this.route.params.subscribe((params) => {
    //   this.userId = params['id'];

    //   this.getUser();
    // });
  }


  /**
   * retrieves user data from the Firestore database based on the userId
   */
  getUser() {
    let userDoc = doc(this.firestore, 'users', this.userId);

    onSnapshot(userDoc, (docSnapshot) => {
      if (docSnapshot.exists()) {
        this.user = new User(docSnapshot.data());
      }
    });
  }

}
