import "./App.css";
import React from "react";
// import PanelComponent from "./components/PanelComponent";
// import WeatherComponent from "./components/WeatherComponent";
// import { useEffect, useState } from "react";
import ClockComponent from "./components/ClockComponent";
import LightsComponent from "./components/LightsComponent";
import ClockWeatherComponent from "./components/ClockWeatherComponent";
import WeatherPanelComponent from "./components/WeatherPanelComponent";
import CalendarComponent from "./components/CalendarComponent";
import AuthRedirect from "./AuthRedirect";


import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/authRedirect" element={<AuthRedirect />} />
      </Routes>
    </Router>
  );
}

function Main() {
  return (
    <div className="App">
      <WeatherPanelComponent />
      <ClockComponent />
      <CalendarComponent />
      <LightsComponent />
      <ClockWeatherComponent />
    </div>
  );
}

function AuthRedirectView() {
  return <div><AuthRedirect /></div>;
}
