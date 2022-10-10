async function fetchWeatherData() {
  var geoData = require("./geoData");
  var apiKeys = require("./apiKeys");
  var key = apiKeys.getKey("weather");
  var weatherPromise = new Promise(() => {});

  let data = geoData
    .getData()
    .then((data) => {
      data = data.response;
      let lat = data.lat;
      let lon = data.lon;
      return fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=imperial`
      );
    })
    .then((a) => {
      return a.json();
    })
    .then((b) => {
      return b;
    });
  return data;
}

module.exports = { fetchWeatherData };
