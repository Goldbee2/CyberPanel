import React, { useState, useEffect } from "react";
import PanelComponent from "./PanelComponent";
import WeatherComponent from "./WeatherComponent";

function ClockWeatherComponent() {
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    setInterval(() => setDate(new Date()), 30000);
  });

  return (
      <div id="clock-weather-panel">
        <div id="clock-weather-timeDate">
          <h2 id="clock-time">
            {date.toLocaleString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </h2>
          <h3 id="clock-date"> {date.toLocaleDateString("en-US")}</h3>
        </div>

        <WeatherComponent />
      </div>
  );
}

export default ClockWeatherComponent;
