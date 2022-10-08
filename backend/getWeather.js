var apiKeys = require("./apiKeys");

// call geocoding API

function getWeather() {
  let personalInfo = require("./personalInfo").parsedFields;

  let zipCode = personalInfo.ZIP_CODE;
  let countryCode = personalInfo.COUNTRY_CODE;

  const getGeocodingData = async (zipCode) => {
    let key = apiKeys.getKey("weather");
    let url = `http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},${countryCode}&appid=${key}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.json;
  };
  let data = getGeocodingData(zipCode).then(console.log(data));
}
console.log(getWeather());
getWeather();
