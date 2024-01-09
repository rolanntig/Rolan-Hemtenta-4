import React, { useState,useEffect } from 'react'
import axios from 'axios'
import Calendar from './components/Calendar'

const Home = () => {

    useEffect( () => {
        axios.get("https://api.openweathermap.org/data/2.5/weather?q=huddinge&appid=05abf85529bfdb321b2ca9f97f52d0b8")
            .then(res => {
            
            
        })
        
    },[])

  return (
    <div className="App">
      <div className="Bond">
        <h1> Bond</h1>
        <h1>Biträdande Rektor</h1>
        <h1>kontakt</h1>
      </div>
      <div className="Weather"></div>
          <div className="Qr"></div>
          <Calendar />
      </div>
      
  );
}

export default Home
