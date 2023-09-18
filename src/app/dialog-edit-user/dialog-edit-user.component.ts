import { Component, inject, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/models/user.class';
import { updateDoc, doc } from 'firebase/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-dialog-edit-user',
  templateUrl: './dialog-edit-user.component.html',
  styleUrls: ['./dialog-edit-user.component.scss']
})


export class DialogEditUserComponent {
  user: User = new User();
  loading = false;
  firestore: Firestore = inject(Firestore);
  userId!: string;
  userForm: FormGroup;


  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<DialogEditUserComponent>) {

    /**
     * validation for angular reactive form
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
   * fills editUser dialog with data from db
   */
  ngOnInit(): void {
    this.userForm.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      job: this.user.job,
      phone: this.user.phone,
      address: this.user.address,
      zipCode: this.user.zipCode,
      city: this.user.city
    }); 
  }


  /**
   * save user detail changes of single user in db
   */
  saveUser() {
    this.loading = true;

    let userDocRef = doc(this.firestore, 'users', this.userId);
    updateDoc(userDocRef, this.userForm.value);

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
