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
    <div className="flex flex-wrap flex-col">
      <div className="flex w-full">
        <div className=" basis-1/2 m-4 p-1 shadow-xl">
          <h1>Next Appointment</h1>
          <div className="">
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
        <div className=" basis-1/2 m-4 p-1 shadow-xl">
          <h1>Active Times</h1>
          <div className="flex flex-wrap p-4">
            {meetingTimes.length != [] ? (
              meetingTimes.map((time) => {
                return (
                  <div className="time" key={time.time}>
                    <button
                      className={`py-2 px-4 rounded focus:outline-none transition-colors ${
                        time.active != 1
                          ? "bg-gray-500 text-gray-100 hover:bg-gray-700"
                          : "bg-blue-500 text-white hover:bg-blue-700"
                      }`}
                      onClick={handleTimeClick}
                      value={time.time}
                    >
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
          <div className="flex justify-center p-4">
            <button
              onClick={handleButtonClick}
              className="bg-blue-500 py-2 px-4 text-white rounded"
            >
              Add Time
            </button>
            {showTimePicker && (
              <form onSubmit={handleSubmit}>
                <label htmlFor="fromTime">From Time:</label>
                <input
                  type="time"
                  id="fromTime"
                  className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                  value={fromTime}
                  onChange={(e) => setFromTime(e.target.value)}
                />
                <br />
                <label htmlFor="toTime">To Time:</label>
                <input
                  type="time"
                  id="toTime"
                  className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                  value={toTime}
                  onChange={(e) => setToTime(e.target.value)}
                />
                <br />
                <button
                  type="submit"
                  className="bg-blue-500 py-2 px-4 text-white rounded"
                >
                  Submit
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <div className=" basis-1/1">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="timeGridDay"
          events={events}
          className="max-w-xs mx-auto"
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
    </div>
  );
};

export default Admin;
