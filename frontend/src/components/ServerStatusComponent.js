import React, { useState, useEffect } from "react";

const backendOrigin = (
  process.env.REACT_APP_API_BASE_URL || "https://localhost:9000"
).replace(/\/$/, "");

const statusIndicatorClass = {
  yellow: "bg-yellow-300",
  green: "bg-green-400",
  red: "bg-red-500",
};

export default function ServerStatusComponent() {
  const [currentStatus, setCurrentStatus] = useState("green");

  function pingServer() {
    console.log("Pinging server...");
    fetch(`${backendOrigin}/status`)
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
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full w-28 flex-row items-center justify-between">
      <p className="m-0 p-0 text-ink-secondary">server status</p>
      <div
        className={`h-3 w-3 shrink-0 rounded-full transition-colors duration-500 ${statusIndicatorClass[currentStatus]}`}
        aria-hidden
      />
    </div>
  );
}
