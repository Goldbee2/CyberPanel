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
        <div className="inline-flex h-4 items-center gap-2">
            <span className="inline-flex h-full items-center font-mono text-xs leading-none tracking-wide text-ink-tertiary">
                SERVER_STATUS
            </span>
            <span
                className={`inline-flex h-full shrink-0 items-center justify-center font-mono text-sm leading-none select-none ${currentStatus === "green" ? "text-lime-400" : currentStatus === "yellow" ? "text-yellow-300" : "text-red-400"}`}
                aria-hidden
            >
                {currentStatus === "green"
                    ? "\u25CD"
                    : currentStatus === "yellow"
                      ? "\u25A6"
                      : "\u25A8"}
            </span>
        </div>
    );
}
