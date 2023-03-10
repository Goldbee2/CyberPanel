const { google } = require("googleapis");
const apiKeys = require("./apiKeys");
// will contain logic for functions of calendar component

// auth token is assumed to exist
// get request
// return unauthorized error
// if request contains auth token:
// fetch cal api data (events readonly)
// return cal api data

// Note: split this function into token exchange and api call.

async function getEvents(oauth2Client) {
  
  var now = new Date();

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  const res = await calendar.events.list({
    auth: oauth2Client,
    calendarId: "primary",
    maxResults: 20,
    singleEvents: true,
    orderBy: "startTime",
    timeMin: now.toISOString(),
  });

  return res.data;
}




module.exports = { getEvents};
