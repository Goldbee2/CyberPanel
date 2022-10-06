function getKey(apiName) {
  var apiKeys = require("dotenv").config({
    path: "./backend/APIKeys.env",
  }).parsed;
  switch (apiName) {
    case "weather":
      return apiKeys.OPENWEATHER_KEY;
    default:
      console.log("Invalid api name passed to getKey: " + apiName);
      return "";
  }
}

module.exports = { getKey };
