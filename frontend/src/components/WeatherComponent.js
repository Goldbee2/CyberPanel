import React from "react";
import { useState, useEffect } from "react";
import PanelComponent from "./PanelComponent";
import Error from "./Error";

function WeatherComponent() {
  const [weatherData, setWeather] = useState({});
  const [componentState, setComponentState] = useState("loading");

  /*
          TO DO

      1. use these icons? --> https://erikflowers.github.io/weather-icons/
      2. write documentation
      3. touch up

  
  */

  useEffect(() => {
    setComponentState("loading");

    fetch("https://192.168.1.127:9000/weather")
      .then((res) => {
        return res.json();
      })
      .then((parsed) => {
        setWeather(parsed);
        console.log(parsed);
        setComponentState("success");
      })
      .catch((err) => {
        console.error("Error:", err);
        setComponentState("error");
      });
  }, []);

  if (componentState === "error") {
    return <Error />;
  } else if (componentState === "success") {
    let currentWeather = weatherData.weather[0];
    let currentWeatherDescription = currentWeather.main;
    let weatherIcon = `https://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`;
    let currentTemp = Math.round(weatherData.main.temp);

    return (
      <div id="weather-info">
        <img id="weather-icon" src={weatherIcon} />
        <div id="weather-info-details">
          <h2 id="weather-info-degrees">{currentTemp}&#176;</h2>
          <p id="weather-info-description">{currentWeatherDescription}</p>
        </div>
      </div>
    );
  }

  return <p>Loading...</p>;
}

export default WeatherComponent;
