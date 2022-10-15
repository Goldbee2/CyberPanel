var express = require("express");
var router = express.Router();
var lightFunctions = require("../lightFunctions");

/* GET users listing. */
router.get("/getLights", function (req, res, next) {
  let a = lightFunctions.getLights();

  a.then((b) => {
    console.log(b);
    res.send(b);
  });
  res.setHeader("content-type", "application/json");
});

// router.post("/setLight/:lightID", function (req, res, next) {
//   res.send("");
//   // Forward command to govee API. Await response, then send back error or success code.

//   // Frontend logic: first: populate lights w/ getLights
//   // Each device in lights list has its own controls etc. linked to a function that sends matching request to API using that device's info
//   // On success response, changes display state to fit w/ it.
// });

module.exports = router;
