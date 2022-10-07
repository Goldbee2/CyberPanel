function getKey(apiName) {
  var parsedKeys = require("dotenv").config({
    path: "./backend/APIKeys.env",
  }).parsed;
  switch (apiName) {
    case "weather":
      return parsedKeys.OPENWEATHER_KEY;
    default:
      console.log("Invalid api name passed to getKey: " + apiName);
      return "";
  }
}

module.exports = { getKey };
