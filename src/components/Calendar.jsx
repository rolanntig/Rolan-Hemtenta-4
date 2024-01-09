import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const Calendar = () => {
  const [bookings, setBookings] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [dates, setDates] = useState();
    
    const navigate = useNavigate();

  useEffect(() => {
    axios.get("/bookings").then((response) => setBookings(response.data));
  }, []);

  const handleDateClick = (arg) => {
    const date = new Date(
      arg.date.getTime() - arg.date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 10);
    const bookedSlots = bookings
      .filter((booking) => booking.date === date)
      .map((booking) => booking.time);
    const allSlots = [
      "09:00-10:00",
      "10:00-11:00",
      "11:00-12:00",
      "12:00-13:00",
      "13:00-14:00",
      "15:00-16:00",
      "16:00-17:00",
    ];
    const slots = allSlots.filter((slot) => !bookedSlots.includes(slot));
      setAvailableSlots(slots);
      setDates(date);
    console.log(`Clicked on: ${date}`);
  };

    const handleSlotClick = (slot, date) => {
        navigate("/booking/finalize", { state: { slot: slot, date:dates  } }, {withCredentials: true});
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        weekends={false}
        dateClick={handleDateClick}
      />
      <div>
        Available slots:
        <div>
          {availableSlots.map((slot, index) => (
            <button key={index} onClick={() => handleSlotClick(slot)}>
              {slot}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
