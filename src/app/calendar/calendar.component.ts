import { Component, inject } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { User } from 'src/models/user.class';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { collection, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
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
  editingExistingAppointment: boolean = false;


  constructor() {

    /**
     * initializes user data, fetches users and appointments from the db
     */
    this.users$ = collectionData(collection(this.firestore, 'users'), { idField: 'id' });
    this.users$.subscribe((changes: any) => {
      this.allUsers = changes;
    });

    this.appointments$ = collectionData(collection(this.firestore, 'appointments'), { idField: 'id' });
    this.appointments$.subscribe((changes: any[]) => {
      this.appointments = changes.map((appointment: any) => {
        return {
          title: `${appointment.topic} | ${appointment.userName}`,
          start: appointment.date,
          id: appointment.id
        };
      });
      this.calendarOptions.events = this.appointments;
    });


    /**
     * sets up time options for appointment scheduling
     */
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
    eventContent: this.renderEventContent.bind(this),
  };


  /**
   * renders the content of a calendar entry. displays the time, the meeting title, and a delete icon.
   * @param {any} eventInfo - information about the event.
   * @returns {any} an object defining the HTML content for the calendar event.
   */
  renderEventContent(eventInfo: any): any {
    let formattedTime = '';
    if (eventInfo.event.start) {
      const eventStart = eventInfo.event.start;
      formattedTime = `${eventStart.getHours().toString().padStart(2, '0')}:${eventStart.getMinutes().toString().padStart(2, '0')}`;
    }

    return {
      html: `
        <div class="meeting-template">
          <span>${formattedTime}</span>
          <span><b>${eventInfo.event.title}</b></span>
        </div>
      `
    };
  }


  /**
   * handles the click on a specific date in the calendar and sets the selected date.
   * @param {MyDateClickArg} arg - contains the selected date.
   */
  handleDateClick(arg: MyDateClickArg) {
    this.selectedDate = arg.date;
    this.selectedUser = null;
    this.selectedTime = null;
    this.meetingTopic = '';
    this.editingExistingAppointment = false;
  }


  /**
   * handles the click on a calendar event. if the delete icon is clicked, the event gets deleted.
   * @param {any} arg - information about the clicked event.
   */
  handleEventClick(arg: any) {
    this.selectedDate = arg.event.start;
    const existingAppointment = this.appointments.find(appointment => appointment.id === arg.event.id);
    if (existingAppointment) {
      this.editingExistingAppointment = true;
      this.meetingTopic = existingAppointment.title.split('|')[0].trim();
      this.selectedUser = this.allUsers.find(user => `${user.firstName} ${user.lastName}` === existingAppointment.title.split('|')[1].trim()) || null;
      this.selectedTime = `${arg.event.start.getHours().toString().padStart(2, '0')}:${arg.event.start.getMinutes().toString().padStart(2, '0')}`;
    }
  }


  /**
   * deletes the specified appointment from both the local state and the db.
   * @param {string} appointmentId - id of the appointment to be deleted.
   */
  async deleteAppointment(appointmentId: string) {
    await this.deleteAppointmentFromBackend(appointmentId);
    this.appointments = this.appointments.filter(app => app.id !== appointmentId);
    this.calendarOptions.events = [...this.appointments];
    this.closeCard();
  }


  /**
   * deletes the selected meeting from the local state and db based on the user and selected date.
   */
  async deleteSelectedMeeting() {
    if (this.selectedUser && this.selectedDate) {
      const existingAppointment = this.appointments.find(app => new Date(app.start).toDateString() === this.selectedDate!.toDateString() && app.title.includes(this.selectedUser!.firstName));
      if (existingAppointment) {
        await this.deleteAppointment(existingAppointment.id);
      }
    }
  }


  /**
   * adds a new appointment to the backend.
   * @param {any} result - an object containing information about the new appointment.
   */
  async addAppointmentToBackend(result: any) {
    const { date, selectedUser, topic } = result;

    await addDoc(collection(this.firestore, 'appointments'), {
      date: date.toISOString(),
      userId: selectedUser.id,
      userName: `${selectedUser.firstName} ${selectedUser.lastName}`,
      topic: topic
    });
  }


  /**
   * updates an existing appointment in the backend with new information.
   * @param {string} appointmentId - id of the appointment to be updated.
   * @param {any} result - an object containing the updated appointment information.
   */
  async updateAppointmentInBackend(appointmentId: string, result: any) {
    const appointmentDocRef = doc(this.firestore, 'appointments', appointmentId);
    await updateDoc(appointmentDocRef, {
      date: result.date.toISOString(),
      userId: result.selectedUser.id,
      userName: `${result.selectedUser.firstName} ${result.selectedUser.lastName}`,
      topic: result.topic
    });
  }


  /**
   * deletes an appointment from the backend.
   * @param {string} appointmentId - the id of the appointment to be deleted.
   */
  async deleteAppointmentFromBackend(appointmentId: string) {
    const appointmentDocRef = doc(this.firestore, 'appointments', appointmentId);
    await deleteDoc(appointmentDocRef);
  }


  /**
   * saves a new meeting using the selected data and times.
   */
  saveMeeting() {
    if (this.selectedUser && this.selectedDate && this.selectedTime && this.meetingTopic.trim()) {
      let adjustedDate = new Date(Date.UTC(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate()));
      const eventDate = new Date(`${adjustedDate.toISOString().split('T')[0]}T${this.selectedTime}:00`);

      // Überprüfen, ob der Termin bereits existiert
      const existingAppointment = this.appointments.find(appointment => appointment.start === eventDate.toISOString());
      if (existingAppointment) {
        // Termin aktualisieren
        this.updateAppointmentInBackend(existingAppointment.id, {
          date: eventDate,
          selectedUser: this.selectedUser,
          topic: this.meetingTopic
        });
      } else {
        // Neuen Termin hinzufügen
        this.addAppointmentToBackend({
          date: eventDate,
          selectedUser: this.selectedUser,
          topic: this.meetingTopic
        });
      }

      this.selectedDate = null;
      this.selectedUser = null;
      this.selectedTime = null;
      this.meetingTopic = '';
    }
  }


  /**
   * closes the currently opened card
   */
  closeCard() {
    this.selectedDate = null;
  }
}
