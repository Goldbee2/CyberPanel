import "./App.css";
import PanelComponent from "./components/PanelComponent";
import WeatherComponent from "./components/WeatherComponent";
import { useEffect, useState } from "react";

function App() {
  return (
    <div className="App">
      <WeatherComponent />
    </div>
  );
}

export default App;
