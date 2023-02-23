var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  const token = req.cookies.googleAuthToken;
  if (token) {
    let((retrievedCalEvents = calendarFunctions.getEvents()));

    retrievedCalEvents.then((calendarEventsResponse) => {
      console.log(calendarEventsResponse);
      res.send(calendarEventsResponse);
    });
  } else {
    res.status(401);
    res.send("No token included with request");
  }
  // let a = calendarFunctions.getEvents();

  // a.then((b) => {
  //   console.log(b);
  //   res.send(b);
  // });
  // res.setHeader("content-type", "application/json");
});

module.exports = router;
