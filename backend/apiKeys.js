// Singleton
var ApiKeys = function () {
  var instance;

  function createInstance() {
    var newInstance = require("dotenv").config({
      path: "./APIKeys.env",
    }).parsed;
    return newInstance;
  }

  function getInstance() {
    if (!instance) {
      instance = createInstance();
    }
    return instance;
  }

  return getInstance();
};

function getKey(apiName) {
  var parsedKeys = ApiKeys();
  switch (apiName) {
    case "weather":
      try {
        return parsedKeys.OPENWEATHER_KEY;
      } catch (err) {
        console.log(err.message);
        return "ERROR_KEY_NOT_FOUND";
      }
    case "govee":
      try{
        return parsedKeys.GOVEE_KEY;
      }catch(err){
        console.log(err.message);
        return "ERROR_KEY_NOT_FOUND";
      }
    default:
      console.log("Invalid api name passed to getKey: " + apiName);
      return "";
  }
}

module.exports = { getKey };
