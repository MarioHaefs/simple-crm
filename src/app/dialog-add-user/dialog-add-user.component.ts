import { Component, inject } from '@angular/core';
import { User } from 'src/models/user.class';
import { MatDialogRef } from '@angular/material/dialog';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { collection, addDoc } from 'firebase/firestore';


@Component({
  selector: 'app-dialog-add-user',
  templateUrl: './dialog-add-user.component.html',
  styleUrls: ['./dialog-add-user.component.scss']
})


export class DialogAddUserComponent {
  user = new User();
  birthDate!: Date;
  firestore: Firestore = inject(Firestore);
  loading = false;


  constructor(private dialogRef: MatDialogRef<DialogAddUserComponent>) {
  }


  /**
   * close dialog window
   */
  closeDialog() {
    this.dialogRef.close();
  }


  /**
   * save new created user to db
   */
  saveUser() {
    this.user.birthDate = this.birthDate.getTime();
    this.loading = true;

    let usersCollectionRef = collection(this.firestore, 'users');  // <-- damit legt (bzw greift darauf zu wenn vorhanden) man eine Sammlung mit dem Namen 'users' in der Firestore Datenbank an
    addDoc(usersCollectionRef, this.user.toJSON());   // <-- damit fügt man einen Json Datensatz(siehe user.class.ts) zu dieser Datenbank hinzu

    setTimeout(() => {
      this.loading = false;
      this.dialogRef.close();
    }, 1000);
  }

}
