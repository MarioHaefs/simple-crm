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
  filteredUsers: User[] = [];

  constructor(public dialog: MatDialog) {

    /**
     * connects to the 'users' collection in Firestore and listens for real-time updates from that collection
     */
    this.users$ = collectionData(collection(this.firestore, 'users'), { idField: 'id' });
    this.users$.subscribe((changes: any) => {
      this.allUsers = changes;
      this.filteredUsers = this.allUsers;
    });

  }


  applyFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement.value.toLowerCase();
    this.filteredUsers = this.allUsers.filter(user => user.firstName.toLowerCase().includes(filterValue));
  }


  /**
   * open mat-card showing DialogAddUserComponent
   */
  openDialog() {
    this.dialog.open(DialogAddUserComponent);
  }

}
