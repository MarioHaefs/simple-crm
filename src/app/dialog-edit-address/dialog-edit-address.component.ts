import { Component, inject } from '@angular/core';
import { User } from 'src/models/user.class';
import { MatDialogRef } from '@angular/material/dialog';
import { Firestore } from '@angular/fire/firestore';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';



@Component({
  selector: 'app-dialog-edit-address',
  templateUrl: './dialog-edit-address.component.html',
  styleUrls: ['./dialog-edit-address.component.scss']
})
export class DialogEditAddressComponent {
  user: User = new User();
  loading = false;
  firestore: Firestore = inject(Firestore);
  userId!: string;


  constructor(private dialogRef: MatDialogRef<DialogEditAddressComponent>) {

  }


  /**
   * save adress changes of single user in db
   */
  saveAddress() {
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
