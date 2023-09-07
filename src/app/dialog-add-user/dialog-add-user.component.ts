import { Component } from '@angular/core';
import { User } from 'src/models/user.class';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-add-user',
  templateUrl: './dialog-add-user.component.html',
  styleUrls: ['./dialog-add-user.component.scss']
})


export class DialogAddUserComponent {
  user = new User();
  birthDate!: Date;

  constructor(private dialogRef: MatDialogRef<DialogAddUserComponent>) {}


  closeDialog() {
    this.dialogRef.close();
  }


  saveUser() {
    this.user.birthDate = this.birthDate.getTime();
    console.log(this.user);
    
  }

}
