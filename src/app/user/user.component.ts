import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';
import { User } from 'src/models/user.class';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { collection, addDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})


export class UserComponent {
  user = new User();
  users$: Observable<any[]>; // <-- diese Variable kann real time observiert werden
  firestore: Firestore = inject(Firestore);
  allUsers: User[] = [];

  constructor(public dialog: MatDialog) {

    this.users$ = collectionData(collection(this.firestore, 'users')); // <-- users$ wird mit unsere DB verknüpft 
    this.users$
    this.users$.subscribe((changes: any) => {           // <-- subscribe loggt und jedes mal raus, wenn etwas an der DB geändert wird
      this.allUsers = changes;
      console.log('Alle User', this.allUsers);
    });



  }


  openDialog() {
    this.dialog.open(DialogAddUserComponent);
  }

}
