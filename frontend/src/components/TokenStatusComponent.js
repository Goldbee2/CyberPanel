import React, { useEffect, useState } from "react";

const backendOrigin = (
    process.env.REACT_APP_API_BASE_URL || "https://localhost:9000"
).replace(/\/$/, "");

export default function TokenStatusComponent() {
    const [hasRefreshToken, setHasRefreshToken] = useState(false);

    function fetchTokenStatus() {
        fetch(`${backendOrigin}/status/tokens`)
            .then((res) => res.json())
            .then((data) => {
                setHasRefreshToken(Boolean(data?.hasRefreshToken));
            })
            .catch(() => {
                setHasRefreshToken(false);
            });
    }

    useEffect(() => {
        fetchTokenStatus();
        const interval = setInterval(fetchTokenStatus, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="inline-flex h-4 items-center gap-2">
            <span className="inline-flex h-full items-center font-mono text-xs leading-none tracking-wide text-ink-tertiary">
                REFRESH_TOKEN
            </span>
            <span
                className={`inline-flex h-full shrink-0 items-center justify-center font-mono text-sm leading-none select-none ${hasRefreshToken ? "text-lime-400" : "text-red-400"}`}
                aria-hidden
            >
                {hasRefreshToken ? "\u25CD" : "\u25A8"}
            </span>
        </div>
    );
}
