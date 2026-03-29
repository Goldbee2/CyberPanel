import React, { useCallback, useEffect, useState } from "react";
import PanelComponent from "./PanelComponent";
import Error from "./Error";

const backendOrigin = (
    process.env.REACT_APP_API_BASE_URL || "https://localhost:9000"
).replace(/\/$/, "");

function supportsTurn(device) {
    if (!Array.isArray(device.supportCmds)) {
        return true;
    }
    return device.supportCmds.includes("turn");
}

function LightsComponent() {
    const [lightData, setLightData] = useState({});
    const [componentState, setComponentState] = useState("loading");
    /** @type {[Record<string, boolean | null>, function]} */
    const [powerByDevice, setPowerByDevice] = useState({});
    const [pendingDevice, setPendingDevice] = useState(null);

    const loadLights = useCallback(() => {
        setComponentState("loading");
        fetch(`${backendOrigin}/lights/getLights`)
            .then((res) => res.json())
            .then((parsed) => {
                const data = parsed?.data;
                if (!data || !Array.isArray(data.devices)) {
                    setComponentState("error");
                    return;
                }
                setLightData(data);
                setComponentState("success");
            })
            .catch((err) => {
                console.error("Error:", err);
                setComponentState("error");
            });
    }, []);

    useEffect(() => {
        loadLights();
    }, [loadLights]);

    const sendPower = useCallback((device, model, on) => {
        const mac = device;
        setPendingDevice(mac);
        fetch(`${backendOrigin}/lights/control`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ device, model, on }),
        })
            .then((res) => res.json().then((body) => ({ res, body })))
            .then(({ res, body }) => {
                if (!res.ok || !body.ok) {
                    console.error("Govee control failed:", body);
                    return;
                }
                setPowerByDevice((prev) => ({ ...prev, [mac]: on }));
            })
            .catch((err) => console.error("Govee control error:", err))
            .finally(() => setPendingDevice(null));
    }, []);

    if (componentState === "error") {
        return (
            <PanelComponent title="LIGHTS">
                <Error />
            </PanelComponent>
        );
    }

    if (componentState === "success") {
        const lights = Array.isArray(lightData?.devices)
            ? lightData.devices
            : [];
        return (
            <PanelComponent title="LIGHTS">
                <ul className="list-none space-y-2 p-0 font-panel-mono text-xs text-ink-secondary">
                    {lights.map((d) => {
                        const device = d.device;
                        const rawPower = powerByDevice[device];
                        const isOn = rawPower === undefined ? null : rawPower;
                        const busy = pendingDevice === device;
                        const canTurn = supportsTurn(d);
                        return (
                            <li
                                key={device}
                                className="flex flex-row flex-wrap items-center gap-x-3 gap-y-2 border-b border-surface-2/60 pb-2 last:border-b-0 last:pb-0"
                            >
                                <span className="min-w-0 flex-1 truncate text-ink-secondary">
                                    <span
                                        className="select-none text-ink-dim"
                                        aria-hidden="true"
                                    >
                                        {"⍚ "}
                                    </span>
                                    {d.deviceName || device}
                                </span>
                                {canTurn ? (
                                    <span className="flex shrink-0 items-center gap-3 font-panel-mono tabular-nums tracking-tight">
                                        <button
                                            type="button"
                                            disabled={busy}
                                            onClick={() =>
                                                sendPower(
                                                    d.device,
                                                    d.model,
                                                    true,
                                                )
                                            }
                                            className="px-0 py-0.5 text-left transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-sky-500 disabled:opacity-40 hover:text-ink-secondary"
                                            aria-pressed={isOn === true}
                                        >
                                            <span
                                                className={
                                                    isOn === true
                                                        ? "text-ink-accent/45"
                                                        : "text-ink-tertiary/35"
                                                }
                                                aria-hidden="true"
                                            >
                                                [
                                            </span>
                                            <span
                                                className={
                                                    isOn === true
                                                        ? "text-ink-accent"
                                                        : "text-ink-dim"
                                                }
                                            >
                                                {" ON  "}
                                            </span>
                                            <span
                                                className={
                                                    isOn === true
                                                        ? "text-ink-accent/45"
                                                        : "text-ink-tertiary/35"
                                                }
                                                aria-hidden="true"
                                            >
                                                ]
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            disabled={busy}
                                            onClick={() =>
                                                sendPower(
                                                    d.device,
                                                    d.model,
                                                    false,
                                                )
                                            }
                                            className="px-0 py-0.5 text-left transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-sky-500 disabled:opacity-40 hover:text-ink-secondary"
                                            aria-pressed={isOn === false}
                                        >
                                            <span
                                                className={
                                                    isOn === false
                                                        ? "text-ink-accent/45"
                                                        : "text-ink-tertiary/35"
                                                }
                                                aria-hidden="true"
                                            >
                                                [
                                            </span>
                                            <span
                                                className={
                                                    isOn === false
                                                        ? "text-ink-accent"
                                                        : "text-ink-dim"
                                                }
                                            >
                                                {" OFF "}
                                            </span>
                                            <span
                                                className={
                                                    isOn === false
                                                        ? "text-ink-accent/45"
                                                        : "text-ink-tertiary/35"
                                                }
                                                aria-hidden="true"
                                            >
                                                ]
                                            </span>
                                        </button>
                                    </span>
                                ) : (
                                    <span className="shrink-0 text-ink-dim">
                                        [N/A]
                                    </span>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </PanelComponent>
        );
    }

    return (
        <PanelComponent title="LIGHTS">
            <p className="font-panel-mono text-sm text-ink-tertiary">
                Loading...
            </p>
        </PanelComponent>
    );
}

export default LightsComponent;
