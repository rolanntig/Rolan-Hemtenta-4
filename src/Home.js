import React, { useState,useEffect } from 'react'
import axios from 'axios'
import Calendar from './components/Calendar'

const Home = () => {

  const [nextAppointment, setNextAppointment] = useState([]);
  
  useEffect(() => {
        axios
          .get("/admin/next/meeting")
          .then((response) => setNextAppointment(response.data));
  },[])


  return (
    <div className="App">
      <div className="Bond">
        <h1> Bond</h1>
        <h1>Biträdande Rektor</h1>
        <h1>kontakt</h1>
      </div>
        <div className="next">
        <h1>Next Appointment</h1>
        <div className="next-appointment">
          {nextAppointment.length != [] ? (
            nextAppointment.map((appointment) => {
              return (
                <div className="appointment" key={appointment.name}>
                  <p>Bonds nästa möte är kl {appointment.time}</p>
                </div>
              );
            })
          ) : (
            <div>
              <h1>Bond har inga möten just nu</h1>
            </div>
          )}
          </div>
          <div className="Qr"></div>
      </div>
      </div>
      
  );
}

export default Home
