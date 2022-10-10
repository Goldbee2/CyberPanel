async function getData() {
  var personalInfo = require("./personalInfo").parsedFields;
  var apiKey = require("./apiKeys").getKey("weather");

  var instance;
  async function createInstance() {
    let newInstance = await fetchGeocodingData(
      personalInfo.ZIP_CODE,
      personalInfo.COUNTRY_CODE,
      apiKey
    ).then(newInstance =>{return newInstance});
    return newInstance;
  }

  function getInstance() {
    if (instance) {
      return instance;
    } else {
      instance = createInstance();
      return instance;
    }
  }
  return getInstance();
}

// /**
// * Summary.                  Fetches geocoding data from openWeather API.
// *
// * Description.             Async function which makes GET request to openWeather API. Response will be an object.
// *                          If errored, object contains two fields (error code and error message). If sucessful,
// *                          object contains 4 fields: zip, name, lat, lon, and country.
// *
// * @param {*} zipCode       ZIP code for desired location
// * @param {*} countryCode   ISO 3166 country code for desired location ('US' for the United States)
// * @param {*} apiKey        API key for OpenWeather. For security practices, should be stored in APIKeys.env
// * @returns
// */

async function fetchGeocodingData(zipCode, countryCode, apiKey) {
  let url = `http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},${countryCode}&appid=${apiKey}`;
  return await fetch(url).then((response) => {
    if (response.ok) {
      return response.json().then((response) => ({ response }));
    }
    return response.json().then((error) => ({ error }));
  });
}

module.exports = { getData };
