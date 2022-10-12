import React, { useState, useEffect } from "react";
import PanelComponent from "./PanelComponent";

function ClockComponent() {
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    setInterval(() => setDate(new Date()), 30000);
  });

  return (
    <PanelComponent title="Clock">
      <h2 id="clock-time">
        {date.toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        })}
      </h2>
      <h3 id="clock-date"> {date.toLocaleDateString("en-US")}</h3>
    </PanelComponent>
  );
}

export default ClockComponent;
