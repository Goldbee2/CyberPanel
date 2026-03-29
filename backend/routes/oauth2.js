var express = require("express");
var router = express.Router();
var oauth2 = require("../oAuth2");
var apiKeys = require("../apiKeys");

router.get("/getRedirect", function (req, res, next) {
  const oauth2Client = req.app.get("oauth2Client");
  let a = oauth2.getRedirectURL(oauth2Client);
  res.set("Content-Type", "text/html");
  res.send(a);
});

router.get("/postAuth", function (req, res, next) {

  const code = req.query.code;
  const oauth2Client = req.app.get("oauth2Client");
  let tokenExchangeStatus = oauth2.exchangeToken(oauth2Client, code);
  tokenExchangeStatus.then((status) => {
    const token = oauth2Client.credentials && oauth2Client.credentials.access_token;
    if (!status || !token) {
      res.status(400).send("OAuth token exchange failed");
      return;
    }
    const configured = (apiKeys.getKey("frontendOrigin") || "").replace(/\/$/, "");
    const frontendBase = configured || "http://localhost:3000";
    const url =
      `${frontendBase}/authRedirect?googleAuthToken=` + encodeURIComponent(token);
    res.redirect(302, url);
  });
  
});

module.exports = router;
