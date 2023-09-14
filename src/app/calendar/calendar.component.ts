import { Component, inject } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/models/user.class';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { collection, addDoc, doc, deleteDoc } from 'firebase/firestore';
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
  timeOptions: string[] = [];
  selectedTime: string | null = null;
  meetingTopic: string = '';
  meetingTopics: string[] = ['Daily', 'Weekly', 'Lunch', 'Feedback', 'Brainstorming', 'Projekt-Review', 'Kick-off'];


  constructor() {
    this.users$ = collectionData(collection(this.firestore, 'users'), { idField: 'id' });
    this.users$.subscribe((changes: any) => {
      this.allUsers = changes;
    });

    this.appointments$ = collectionData(collection(this.firestore, 'appointments'), { idField: 'id' });
    this.appointments$.subscribe((changes: any[]) => {
      this.appointments = changes.map((appointment: any) => {
        return {
          title: `${appointment.topic} | ${appointment.userName}`,
          start: appointment.date
        };
      });
      this.calendarOptions.events = this.appointments;
    });


    for (let hour = 8; hour <= 18; hour++) {
      for (let minute of [0, 30]) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        this.timeOptions.push(timeString);
      }
    }
  }

  /**
   * calendar settings
   */
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
    validRange: {
      start: new Date()
    },
    weekends: false,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: ''
    },
    eventClick: this.handleEventClick.bind(this),
  };


  handleDateClick(arg: MyDateClickArg) {
    this.selectedDate = arg.date;
  }


  async handleEventClick(arg: any) {
    const appointmentId = arg.event.id;
    await this.deleteAppointmentFromBackend(appointmentId);
  }



  async addAppointmentToBackend(result: any) {
    const { date, selectedUser, topic } = result;

    await addDoc(collection(this.firestore, 'appointments'), {
      date: date.toISOString(),
      userId: selectedUser.id,
      userName: `${selectedUser.firstName} ${selectedUser.lastName}`,
      topic: topic
    });
  }


  async deleteAppointmentFromBackend(appointmentId: string) {
    const appointmentDocRef = doc(this.firestore, 'appointments', appointmentId);
    await deleteDoc(appointmentDocRef);
  }



  saveMeeting() {
    if (this.selectedUser && this.selectedDate && this.selectedTime && this.meetingTopic.trim()) {

      let adjustedDate = new Date(Date.UTC(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate()));

      this.addAppointmentToBackend({
        date: new Date(`${adjustedDate.toISOString().split('T')[0]}T${this.selectedTime}:00`),
        selectedUser: this.selectedUser,
        topic: this.meetingTopic
      });
      this.selectedDate = null;
      this.selectedUser = null;
      this.selectedTime = null;
      this.meetingTopic = '';
    }
  }


  closeCard() {
    this.selectedDate = null;
  }
}
