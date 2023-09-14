import { Component, inject } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/models/user.class';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { collection, addDoc, doc } from 'firebase/firestore';
import { Observable } from 'rxjs';

interface MyDateClickArg {
  date: Date;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  user = new User;
  users$: Observable<any[]>;
  firestore: Firestore = inject(Firestore);
  allUsers: User[] = [];
  selectedDate: Date | null = null;
  appointments$: Observable<any[]>;
  appointments: any[] = [];
  selectedUser: User | null = null;


  constructor() {
    this.users$ = collectionData(collection(this.firestore, 'users'), { idField: 'id' });
    this.users$.subscribe((changes: any) => {
      this.allUsers = changes;
    });

    this.appointments$ = collectionData(collection(this.firestore, 'appointments'), { idField: 'id' });
    this.appointments$.subscribe((changes: any[]) => {
      this.appointments = changes.map((appointment: any) => {
        return {
          title: appointment.userName,
          start: appointment.date
        };
      });
      this.calendarOptions.events = this.appointments;
    });
  }


  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: this.handleDateClick.bind(this),
    events: this.appointments,
    displayEventTime: true,
    eventTimeFormat: {
      hour: 'numeric',
      minute: '2-digit',
      meridiem: 'short'
    },
    eventColor: '#E67708',
    validRange: {
      start: new Date()
    },
  };


  handleDateClick(arg: MyDateClickArg) {
    this.selectedDate = arg.date;
  }


  async addEventToFirebase(result: any) {
    const { date, selectedUser } = result;
    try {
      await addDoc(collection(this.firestore, 'appointments'), {
        date: date.toISOString(),
        userId: selectedUser.id,
        userName: `${selectedUser.firstName} ${selectedUser.lastName}`
      });
      console.log('Appointment added successfully');
    } catch (error) {
      console.error("Error adding appointment: ", error);
    }
  }


  saveMeeting() {
    if (this.selectedUser && this.selectedDate) {
      this.addEventToFirebase({
        date: new Date(`${this.selectedDate.toISOString().split('T')[0]}T12:00:00`),
        selectedUser: this.selectedUser
      });
      this.selectedDate = null;
      this.selectedUser = null;
    }
  }


  closeCard() {
    this.selectedDate = null;
  }
}
