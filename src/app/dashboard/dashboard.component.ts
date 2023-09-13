import { Component, inject } from '@angular/core';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { collection, addDoc, doc, getDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { User } from 'src/models/user.class';
import { ChartType, ChartOptions, ChartData } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  firestore: Firestore = inject(Firestore);
  user: User = new User();
  userId = '';


  constructor(private route: ActivatedRoute, public dialog: MatDialog, private router: Router) {

    // this.route.params.subscribe((params) => {
    //   this.userId = params['id'];

    //   this.getUser();
    // });
  }


  /**
   * retrieves user data from the Firestore database based on the userId
   */
  getUser() {
    let userDoc = doc(this.firestore, 'users', this.userId);

    onSnapshot(userDoc, (docSnapshot) => {
      if (docSnapshot.exists()) {
        this.user = new User(docSnapshot.data());
      }
    });
  }


  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: string[] = ['Verkäufe', 'Rücksendungen', 'Fragen'];
  public pieChartData: ChartData<'pie'> = {
    datasets: [{
      data: [300, 50, 100],
      label: 'Kuchenchart'
    }]
  };
  public pieChartType: ChartType = 'pie';


  public lineChartOptions: ChartOptions = {
    responsive: true,
  };
  public lineChartLabels: string[] = ['Januar', 'Februar', 'März', 'April', 'Mai'];
  public lineChartData: { data: number[], label: string }[] = [
    { data: [65, 59, 80, 81, 56], label: 'Bestellungen' }
  ];
  public lineChartType: ChartType = 'line';

}
