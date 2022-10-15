import React, { useEffect, useState } from "react";
import PanelComponent from "./PanelComponent";
import Error from "./Error";

function generateDeviceDOMElement(device) {
  console.log("DEVICE", device);
  return (
    <li className="deviceListElement">
      <span className="material-symbols-outlined govee-devices-list-icon">lightbulb</span>
      {device.deviceName}
    </li>
  );
}

function LightsComponent() {
  const [lightData, setLightData] = useState({});
  const [componentState, setComponentState] = useState("loading");

  useEffect(() => {
    setComponentState("loading");

    fetch("http://192.168.1.125:9000/lights/getLights")
      .then((res) => {
        return res.json();
      })
      .then((parsed) => {
        setLightData(parsed.data);
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
    let lights = lightData.devices;
    console.log("Lights:", lights);
    return (
      <PanelComponent title="Govee Lights">
        <ul id="goveeDevicesList">{lights.map(generateDeviceDOMElement)}</ul>
      </PanelComponent>
    );
  }
}

export default LightsComponent;
