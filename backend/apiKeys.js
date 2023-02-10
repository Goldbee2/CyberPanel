// Singleton
// TODO: refactor the whole env keyring function, don't think the singleton pattern is needed
// TODO: research key in memory best practices, want to make reduce vulnerabilities


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


// Hideous function that evolved over time to be disgusting, need to refactor. Probably a good design pattern for this one?

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
     case "oauth2ClientID":
      try{
        return parsedKeys.OAUTH2_CLIENT_ID;
      }catch(err){
        console.log(err.message);
        return "ERROR_KEY_NOT_FOUND";
      }

      case "oauth2ClientSecret":
      try{
        return parsedKeys.OAUTH2_CLIENT_SECRET;
      }catch(err){
        console.log(err.message);
        return "ERROR_KEY_NOT_FOUND";
      }

      case "oauth2RedirectURL":
      try{
        return parsedKeys.OAUTH2_REDIRECT_URL;
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
