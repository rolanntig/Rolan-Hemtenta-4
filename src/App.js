import logo from "./logo.svg";
import "./App.css";
import Calendar from "./components/Calendar";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import BookingForm from "./components/BookingForm";
import Login from "./components/Login";
import Admin from "./components/Admin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/booking" element={<Calendar />} />
      <Route path="/booking/finalize" element={<BookingForm />} />
      <Route path="/admin/auth/login" element={<Login />} />
      <Route path="/admin/dashboard" element={<Admin />} />
    </Routes>
  );
}

export default App;
