import React, { useState, useEffect } from "react";

function formatClockDate(d: Date) {
    return d.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });
}

export default function ClockSection() {
    const [date, setDate] = useState(new Date());
    useEffect(() => {
        const id = window.setInterval(() => setDate(new Date()), 30000);
        return () => window.clearInterval(id);
    }, []);

    return (
        <div className="flex flex-col gap-1 leading-none align-middle">
            <h2 className="font-display text-[4rem] text-ink">
                {date.toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                }).toLowerCase()}
            </h2>
            <h3 className="text-xl font-display text-ink-tertiary">
                {formatClockDate(date)}
            </h3>
        </div>
    );
}
