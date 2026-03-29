import React, { useEffect, useState } from "react";
import PanelComponent from "./PanelComponent";
import Error from "./Error";

const backendOrigin = (
  process.env.REACT_APP_API_BASE_URL || "https://localhost:9000"
).replace(/\/$/, "");

console.log(backendOrigin, process.env);

function generateDeviceDOMElement(device) {
  return (
    <li className="flex flex-row items-center text-ink-secondary">
      <span className="material-symbols-outlined mr-2.5">lightbulb</span>
      {device.deviceName}
    </li>
  );
}

function LightsComponent() {
  const [lightData, setLightData] = useState({});
  const [componentState, setComponentState] = useState("loading");

  useEffect(() => {
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

  if (componentState === "error") {
    return (
      <PanelComponent>
        <Error />
      </PanelComponent>
    );
  } else if (componentState === "success") {
    const lights = Array.isArray(lightData?.devices) ? lightData.devices : [];
    return (
      <PanelComponent title="Govee Lights">
        <ul className="list-none p-0">{lights.map(generateDeviceDOMElement)}</ul>
      </PanelComponent>
    );
  }

  return (
    <PanelComponent title="Govee Lights">
      <p className="text-ink-tertiary">Loading...</p>
    </PanelComponent>
  );
}

export default LightsComponent;
