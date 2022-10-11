import React from "react";
import { useState, useEffect } from "react";
import PanelComponent from "./PanelComponent";
import Error from "./Error";

function WeatherComponent() {
  const [response, query] = useState({});
  const [weather, setWeather] = useState({});
  const [componentState, setComponentState] = useState("");

  /*
          TO DO

      1. use these icons? --> https://erikflowers.github.io/weather-icons/
      2. write documentation
      3. touch up

  
  */

  useEffect(() => {
    setComponentState("loading");

    fetch("http://192.168.1.125:9000/weather")
      .then((res) => {
        
        console.log("res before parsing:", res);
        return res.json();
      })
      .then((parsed) => {
        console.log(parsed.weather[0]);
        setWeather(parsed.weather[0]);
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
    let currentWeather = weather.main;
    let weatherIcon = `http://openweathermap.org/img/wn/${weather.icon}@4x.png`;
    return (
      <PanelComponent>
        <img id="weather-icon" src={weatherIcon}/>
        <p>{currentWeather}</p>
      </PanelComponent>
    );
  }

  return (
    <PanelComponent>
      <p>Loading...</p>
    </PanelComponent>
  );
}

export default WeatherComponent;
