import React, { useState, useEffect } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";

const Admin = () => {
  const [nextAppointment, setNextAppointment] = useState([]);
  const [meetingTimes, setMeetingTimes] = useState([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get("/admin/next/meeting")
      .then((response) => setNextAppointment(response.data));
    axios
      .get("/admin/meeting/times")
      .then((response) => setMeetingTimes(response.data));
axios.get("/admin/meeting/today")
  .then(response => {
    const events = response.data.map((event) => {
      const [startTime, endTime] = event.time.split('-'); // Split time range

      // Parse start time
      const [startHour, startMinute] = startTime.split(':');
      const startDate = new Date(event.date);
      startDate.setHours(parseInt(startHour, 10));
      startDate.setMinutes(parseInt(startMinute, 10));

      // Parse end time
      const [endHour, endMinute] = endTime.split(':');
      const endDate = new Date(event.date);
      endDate.setHours(parseInt(endHour, 10));
      endDate.setMinutes(parseInt(endMinute, 10));

      return {
        title: event.name,
        start: startDate,
        end: endDate,
        // Add other necessary properties based on your events
      };
    });

    setEvents(events);
  })
  .catch((error) => {
    console.error("Error fetching events:", error);
  });
  }, []);

  console.log(events);

  const handleTimeClick = (event) => {
    const selectedTime = meetingTimes.find(
      (time) => time.time === event.target.value
    );
    if (selectedTime) {
      axios.post("/admin/meeting/times", selectedTime);
    } else {
      alert("Time not found");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const selectedTimeRange = `${fromTime}-${toTime}`;
    console.log("Selected Time Range:", selectedTimeRange);
    axios.post("/admin/time/add", { time: selectedTimeRange });
  };

  const handleButtonClick = () => {
    setShowTimePicker(!showTimePicker);
  };

  return (
    <div className="dashboard">
      <div className="next">
        <h1>Next Appointment</h1>
        <div className="next-appointment">
          {nextAppointment.length != [] ? (
            nextAppointment.map((appointment) => {
              return (
                <div className="appointment" key={appointment.name}>
                  <p>{appointment.name}</p>
                  <p>{appointment.last_name}</p>
                  <p>{appointment.email}</p>
                  <p>{appointment.phone}</p>
                  <p>{appointment.date}</p>
                  <p>{appointment.time}</p>
                </div>
              );
            })
          ) : (
            <div>
              <h1>No appointments</h1>
            </div>
          )}
        </div>
      </div>
      <div className="times">
        <h1>Active Times</h1>
        <div className="times-list">
          {meetingTimes.length != [] ? (
            meetingTimes.map((time) => {
              return (
                <div className="time" key={time.time}>
                  <button onClick={handleTimeClick} value={time.time}>
                    {time.time}
                  </button>
                </div>
              );
            })
          ) : (
            <div>
              <p>No times</p>
            </div>
          )}
        </div>
        <div className="Add-Time">
          <button onClick={handleButtonClick}>Add Time</button>
          {showTimePicker && (
            <form onSubmit={handleSubmit}>
              <label htmlFor="fromTime">From Time:</label>
              <input
                type="time"
                id="fromTime"
                value={fromTime}
                onChange={(e) => setFromTime(e.target.value)}
              />
              <br />
              <label htmlFor="toTime">To Time:</label>
              <input
                type="time"
                id="toTime"
                value={toTime}
                onChange={(e) => setToTime(e.target.value)}
              />
              <br />
              <button type="submit">Submit</button>
            </form>
          )}
        </div>
      </div>
      <div className="schedule">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="timeGridDay"
          events={events}
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          slotDuration="00:30:00" // Adjust as needed (this example sets slots to 30 minutes)
          slotMinTime="08:00:00" // Adjust start time
          slotMaxTime="18:00:00" // Adjust end time
          dayHeaderFormat={{
            weekday: "short",
            month: "numeric",
            day: "numeric",
          }}
          titleFormat={{
            year: "numeric",
            month: "long",
            day: "numeric",
          }}
        />
      </div>
      <div className="buttons">
        
      </div>
    </div>
  );
};

export default Admin;
