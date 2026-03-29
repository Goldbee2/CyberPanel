import React, { useState, useEffect } from "react";
import WeatherComponent from "./Weather/WeatherComponent";

function formatClockDate(d) {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function ClockWeatherComponent() {
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setDate(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-0.5">
        <h2 className="m-0 font-display text-5xl text-ink">
          {date.toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
        </h2>
        <h3 className="m-0 text-sm font-normal text-ink-secondary">
          {formatClockDate(date)}
        </h3>
      </div>

      <WeatherComponent />
    </div>
  );
}

export default ClockWeatherComponent;
