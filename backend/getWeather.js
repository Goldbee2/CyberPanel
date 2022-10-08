var apiKeys = require("./apiKeys");



/**
 * Summary.                  Fetches geocoding data from openWeather API.
 *
 * Description.             Async function which makes GET request to openWeather API. Response will be an object.
 *                          If errored, object contains two fields (error code and error message). If sucessful,
 *                          object contains 4 fields: zip, name, lat, lon, and country.
 *
 * @param {*} zipCode       ZIP code for desired location
 * @param {*} countryCode   ISO 3166 country code for desired location ('US' for the United States)
 * @param {*} apiKey        API key for OpenWeather. For security practices, should be stored in APIKeys.env
 * @returns
 */

async function fetchGeocodingData(zipCode, countryCode, apiKey) {
  let url = `http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},${countryCode}&appid=${apiKey}`;

  return fetch(url).then((response) => {
    if (response.ok) {
      return response.json().then((response) => ({ response }));
    }
    return response.json().then((error) => ({ error }));
  });
}





async function fetchWeatherData() {
  let personalInfo = require("./personalInfo").parsedFields;
  let key = require("./apiKeys").getKey("weather");
  let zipCode = personalInfo.ZIP_CODE;
  let countryCode = personalInfo.COUNTRY_CODE;

  const { response, error } = await fetchGeocodingData(
    zipCode,
    countryCode,
    key
  );
  if (response) {
    console.log("Response: ", response);
  } else {
    console.log("Error:", error);
  }
}

fetchWeatherData();
