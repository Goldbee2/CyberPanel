var express = require("express");
var router = express.Router();
var oauth2 = require("../oAuth2");
var apiKeys = require("../apiKeys");

/** Ensures res.redirect gets an absolute URL (avoids relative resolution under /oauth2). */
function toAbsoluteFrontendOrigin(base) {
  var s = String(base).replace(/\/$/, "").trim();
  if (!s || s === "ERROR_KEY_NOT_FOUND") return s;
  if (/^https:\/\//i.test(s) || /^http:\/\//i.test(s)) return s;
  if (/^https:/i.test(s))
    return "https://" + s.replace(/^https:\/*/i, "");
  if (/^http:/i.test(s)) return "http://" + s.replace(/^http:\/*/i, "");
  return "http://" + s.replace(/^\/+/, "");
}

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
    if (!status) {
      res.status(400).send("Token exchange failed");
      return;
    }
    const base = apiKeys.getKey("frontendOrigin");
    if (!base || base === "ERROR_KEY_NOT_FOUND") {
      console.error("FRONTEND_ORIGIN missing or invalid in APIKeys.env");
      res.status(500).send("Server misconfiguration: FRONTEND_ORIGIN");
      return;
    }
    const origin = toAbsoluteFrontendOrigin(base);
    const token = oauth2Client.credentials.access_token;
    const url =
      origin +
      "/authRedirect?googleAuthToken=" +
      encodeURIComponent(token);
    res.redirect(url);
  });
  
});

module.exports = router;
