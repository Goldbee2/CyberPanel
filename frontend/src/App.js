import "./App.css";
import PanelComponent from "./components/PanelComponent";
import WeatherComponent from "./components/WeatherComponent";
import { useEffect, useState } from "react";
import ClockComponent from "./components/ClockComponent";
import LightsComponent from "./components/LightsComponent";
import ClockWeatherComponent from "./components/ClockWeatherComponent";
import WeatherPanelComponent from "./components/WeatherPanelComponent";

function App() {
  return (
    <div className="App">
      <WeatherPanelComponent/>
      <ClockComponent/>
      <LightsComponent/>
      <ClockWeatherComponent/>
    </div>
  );
}

export default App;
