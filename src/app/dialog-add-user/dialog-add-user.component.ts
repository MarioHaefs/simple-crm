import { Component, inject } from '@angular/core';
import { User } from 'src/models/user.class';
import { MatDialogRef } from '@angular/material/dialog';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { collection, addDoc } from 'firebase/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-dialog-add-user',
  templateUrl: './dialog-add-user.component.html',
  styleUrls: ['./dialog-add-user.component.scss']
})


export class DialogAddUserComponent {
  user = new User();
  firestore: Firestore = inject(Firestore);
  loading = false;
  userForm: FormGroup;


  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<DialogAddUserComponent>) {

    /**
     * validation for angular reacitve form
     */
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-ZäöüÄÖÜß& ]*$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-ZäöüÄÖÜß& ]*$')]],
      email: ['', [Validators.required, Validators.email]],
      job: ['', [Validators.required, Validators.pattern('^[a-zA-ZäöüÄÖÜß& ]*$')]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9+]*$')]],
      address: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.minLength(4)]],
      city: ['', Validators.required]
    });
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
    this.loading = true;

    let usersCollectionRef = collection(this.firestore, 'users');
    addDoc(usersCollectionRef, this.userForm.value);

    setTimeout(() => {
      this.loading = false;
      this.dialogRef.close();
    }, 1000);
  }

}