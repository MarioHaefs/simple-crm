import { Component, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/models/user.class';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

@Component({
  selector: 'app-dialog-edit-user',
  templateUrl: './dialog-edit-user.component.html',
  styleUrls: ['./dialog-edit-user.component.scss']
})
export class DialogEditUserComponent {
  user: User = new User();
  loading = false;
  birthDate!: Date;
  firestore: Firestore = inject(Firestore);
  userId!: string;


  constructor(private dialogRef: MatDialogRef<DialogEditUserComponent>) {

  }


  /**
   * save user detail changes of single user in db
   */
  saveUser() {
    this.loading = true;

    let userDocRef = doc(this.firestore, 'users', this.userId);
    updateDoc(userDocRef, this.user.toJSON());

    setTimeout(() => {
      this.loading = false;
      this.dialogRef.close();
    }, 1000);
  }


  /**
   * close dialog window
   */
  closeDialog() {
    this.dialogRef.close();
  }
}
