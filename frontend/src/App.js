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
import ToDoList from "./components/ToDoListComponent";
import AuthRedirect from "./AuthRedirect";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PanelComponent from "./components/PanelComponent";

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
      <div id="split-left">
        <ClockComponent />
        <PanelComponent title="To Do">
          <ToDoList />
        </PanelComponent>
      </div>
      <div id="split-right">
        <WeatherPanelComponent />
        <LightsComponent />
        <CalendarComponent />
      </div>
    </div>
  );
}

function AuthRedirectView() {
  return (
    <div>
      <AuthRedirect />
    </div>
  );
}
