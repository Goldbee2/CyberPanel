var express = require("express");
var router = express.Router();
var { google } = require("googleapis");
var calendarFunctions = require("../calendarFunctions");
var apiKeys = require("../apiKeys");

router.get("/", function (req, res, next) {
  const authHeader = req.headers.authorization || "";
  const bearer =
    authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";

  const singletonClient = req.app.get("oauth2Client");
  let oauth2Client = singletonClient;

  if (bearer) {
    oauth2Client = new google.auth.OAuth2(
      apiKeys.getKey("oauth2ClientID"),
      apiKeys.getKey("oauth2ClientSecret"),
      apiKeys.getKey("oauth2RedirectURL")
    );
    oauth2Client.setCredentials({ access_token: bearer });
  }

  if (oauth2Client.credentials && oauth2Client.credentials.access_token) {
    console.log("RETRIEVING EVENTS");
    // This function is a clean code disaster--getEvents has side effects, does multiple things not listed under name
    let retrievedCalEvents = calendarFunctions.getEvents(oauth2Client);

    retrievedCalEvents.then((calendarEventsResponse) => {
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
