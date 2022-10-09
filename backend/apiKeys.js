// Singleton
var ApiKeys = (function() {
  var instance;

  function createInstance(){
    var newInstance = require("dotenv").config({
      path: "./backend/APIKeys.env",
    }).parsed;
    return newInstance;
  }

  function getInstance(){
    if(!instance){
      instance = createInstance();
    }
    return instance;
  }

  return getInstance();
})

function getKey(apiName) {
  var parsedKeys = ApiKeys();
  switch (apiName) {
    case "weather":
      return parsedKeys.OPENWEATHER_KEY;
    default:
      console.log("Invalid api name passed to getKey: " + apiName);
      return "";
  }
}


module.exports = { getKey };
