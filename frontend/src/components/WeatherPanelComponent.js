import React from "react";
import { useState, useEffect } from "react";
import PanelComponent from "./PanelComponent";
import Error from "./Error";

function WeatherPanelComponent() {
  const [response, query] = useState({});
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

    fetch("http://192.168.1.127:9000/weather")
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
    return (
      <PanelComponent title="weather">
        <Error />
      </PanelComponent>
    );
  } else if (componentState === "success") {
    let currentWeather = weatherData.weather[0];
    let currentWeatherDescription = currentWeather.main;
    let weatherIcon = `http://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`;
    let currentTemp =Math.round(weatherData.main.temp);


    return (
      <PanelComponent title="Weather">
        <div id="weather-info">
          <img id="weather-icon" src={weatherIcon} />
          <div id="weather-info-details">
            <h2 id="weather-info-degrees">{currentTemp}&#176;</h2>
            <p>{currentWeatherDescription}</p>
          </div>
        </div>
      </PanelComponent>
    );
  }

  return (
    <PanelComponent title="Weather">
      <p>Loading...</p>
    </PanelComponent>
  );
}

export default WeatherPanelComponent;
