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
  userCount: number = 0;



  constructor(private route: ActivatedRoute, public dialog: MatDialog, private router: Router) {

    this.getUserCount();

  }


  /**
   * retrieves total user amount out of db
   */
  getUserCount() {
    const userCollection = collection(this.firestore, 'users');

    onSnapshot(userCollection, (querySnapshot) => {
      this.userCount = querySnapshot.size;
    });
  }


  /**
   * pie chart options
   */
  public pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false // Versteckt die Legende
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.label + ': €' + context.parsed;
          }
        }
      }
    }
  };


  /**
   * pie chart data 
   */
  public pieChartDataRevenue: ChartData<'pie'> = {
    labels: ['Product Sales', 'Services', 'Licensing Fees', 'Other Revenues'],
    datasets: [{
      data: [97500, 30000, 15000, 7500]
    }]
  };

  public pieChartDataCosts: ChartData<'pie'> = {
    labels: ['Staff', 'Rent', 'Marketing', 'Development', 'Other Costs'],
    datasets: [{
      data: [60000, 30000, 22500, 22500, 15000]
    }]
  };


  public pieChartDataInvestments: ChartData<'pie'> = {
    labels: ['Technology ', 'Research', 'Education', 'Advertising'],
    datasets: [{
      data: [75000, 37500, 22500, 15000]
    }]
  };

  public pieChartType: ChartType = 'pie';


  /**
   * line chart options
   */
  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          color: 'white'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y: {
        ticks: {
          color: 'white',
          callback: function (value) {
            return value + '€';
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'white'
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.dataset.label + ': ' + context.parsed.y + '€';
          }
        }
      }
    }
  };


  /**
   * line chart data
   */
  public lineChartLabels: string[] = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

  public lineChartData: { data: number[], label: string }[] = [

    { data: [7000, 6500, 9000, 11000, 8200, 7900, 5600, 7300, 9700, 12000, 10000, 10500], label: 'Income' },

    { data: [5000, 4300, 3500, 6000, 5200, 5000, 4800, 4500, 4700, 5300, 5100, 4900], label: 'Expenses' },

    { data: [2000, 2200, 5500, 5000, 3000, 2900, 800, 2800, 5000, 6700, 4900, 5600], label: 'Turnover' }
  ];

  public lineChartType: ChartType = 'line';


}
