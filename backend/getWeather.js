var apiKeys = require("./apiKeys");

// call geocoding API

var myZipCode = 98103;
var countryCode = "US";

const getGeocodingData = async (zip) => {
  let key = apiKeys.getKey("weather");
  let url = `http://api.openweathermap.org/geo/1.0/zip?zip=${zip},${countryCode}&appid=${key}`;
  const res = await fetch(url);
  const data = await res.json();
};