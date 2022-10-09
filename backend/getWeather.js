





function getWeather(){


    /**
     * If weather data doesn't exist, request it from server
     * If weather data does exist, return it
     */


}









async function fetchWeatherData(lat, long, apiKey) {

}

let personalInfo = require("./personalInfo").parsedFields;
var apiKeys = require("./apiKeys");
console.log(apiKeys.getKey('weather'));
let zipCode = personalInfo.ZIP_CODE;
let countryCode = personalInfo.COUNTRY_CODE;


var geoData = function(){
    var instance;


}



// const { response: geoData, error } = await fetchGeocodingData(
//   zipCode,
//   countryCode,
//   key
// );

// if (error) {
//   console.log(`Error ${error.cod}: ${error.message}`);
//   return null;
// }

// console.log(geoData);

fetchWeatherData();
