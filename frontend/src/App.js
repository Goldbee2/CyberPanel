import "./App.css";
import PanelComponent from "./components/PanelComponent";
import WeatherComponent from "./components/WeatherComponent";
import { useEffect, useState } from "react";
import ClockComponent from "./components/ClockComponent";

function App() {
  return (
    <div className="App">
      <WeatherComponent/>
      <ClockComponent/>
    </div>
  );
}

export default App;
