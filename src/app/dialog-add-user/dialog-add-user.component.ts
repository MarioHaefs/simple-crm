import { Component, inject } from '@angular/core';
import { User } from 'src/models/user.class';
import { MatDialogRef } from '@angular/material/dialog';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { collection, addDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-dialog-add-user',
  templateUrl: './dialog-add-user.component.html',
  styleUrls: ['./dialog-add-user.component.scss']
})


export class DialogAddUserComponent {
  user = new User();
  birthDate!: Date;
  public firestore: Firestore = inject(Firestore);
  users$: Observable<{}[]>;
  loading = false;


  constructor(private dialogRef: MatDialogRef<DialogAddUserComponent>) {
    const usersCollectionRef = collection(this.firestore, 'users');
    this.users$ = collectionData(usersCollectionRef);
  }


  closeDialog() {
    this.dialogRef.close();
  }


  saveUser() {
    this.user.birthDate = this.birthDate.getTime();
    this.loading = true;

    let usersCollectionRef = collection(this.firestore, 'users');
    addDoc(usersCollectionRef, this.user.toJSON());

    setTimeout(() => {
      this.loading = false;
      this.dialogRef.close();
    }, 1500);
  }

}
