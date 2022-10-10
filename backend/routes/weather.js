var getWeather = require("../getWeather");
var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  let a = getWeather.fetchWeatherData();
  a.then((b) => {
    res.setHeader("content-type", "application/json");
    res.send(b);
  });

});

module.exports = router;
