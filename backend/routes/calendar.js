var express = require("express");
var router = express.Router();
var calendarFunctions = require("../calendarFunctions");

router.get("/", function (req, res, next) {
  
  const oauth2Client = req.app.get("oauth2Client");

  if (oauth2Client.credentials.access_token) {
    console.log("RETRIEVING EVENTS");
    // This function is a clean code disaster--getEvents has side effects, does multiple things not listed under name
    let retrievedCalEvents = calendarFunctions.getEvents(oauth2Client);

    retrievedCalEvents.then((calendarEventsResponse) => {
      console.log("RESPONSE:", calendarEventsResponse);
      res.send(calendarEventsResponse);
    });
  } else {
    res.status(401);
    res.send("No token exists in oauth2Client");
  }
  // let a = calendarFunctions.getEvents();

  // a.then((b) => {
  //   console.log(b);
  //   res.send(b);
  // });
  // res.setHeader("content-type", "application/json");
});

module.exports = router;
