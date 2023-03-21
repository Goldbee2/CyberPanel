import React, { useState, useEffect } from "react";

export default function ServerStatusComponent() {
  const [currentStatus, setCurrentStatus] = useState("green");

  const statusColors = {
    yellow: "rgb(255,255,100)",
    green: "rgb(100, 255, 100)",
    red: "rgb(211, 60, 60",
  };

  function createServerStatusIcon(currentStatusColor) {
    let currentStatusCSSColor = statusColors[currentStatusColor];
    console.log(currentStatusCSSColor);
    return <div style={{ backgroundColor: currentStatusColor }}></div>;
  }

  function pingServer() {
    console.log("Pinging server...");
    fetch("https://localhost:9000/status")
      .then((res) => {
        console.log("Status:", res.status);
        if (res.status === 200) {
          setCurrentStatus("green");
        } else {
          setCurrentStatus("yellow");
        }
      })
      .catch((error) => {
        setCurrentStatus("red");
        console.log(error);
      });
  }

  useEffect(() => {
    const interval = setInterval(() => {
      pingServer();
    }, 10000);
  });

  return (
    <div id="server-status">
      <p id="server-status-label">server status</p>
      <div
        id="server-status-indicator"
        style={{
          backgroundColor: statusColors[currentStatus],
          transition: "0.6s",
        }}
      />
    </div>
  );
}
