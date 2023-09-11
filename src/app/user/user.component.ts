import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';
import { User } from 'src/models/user.class';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { collection, addDoc, doc } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})


export class UserComponent {
  user = new User();
  users$: Observable<any[]>;
  firestore: Firestore = inject(Firestore);
  allUsers: User[] = [];

  constructor(public dialog: MatDialog) {

    /**
     * connects to the 'users' collection in Firestore and listens for real-time updates from that collection
     */
    this.users$ = collectionData(collection(this.firestore, 'users'), { idField: 'id' });
    this.users$.subscribe((changes: any) => {
      this.allUsers = changes;
    });



  }


  /**
   * open mat-card showing DialogAddUserComponent
   */
  openDialog() {
    this.dialog.open(DialogAddUserComponent);
  }

}
