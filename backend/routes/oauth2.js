var express = require("express");
var router = express.Router();
var oauth2 = require("../oAuth2");

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
    res.status(status ? 200 : 400);
    let token=oauth2Client.credentials.access_token;
    console.log(token);
    let url = "https://192.168.1.127:3000/authRedirect?googleAuthToken="+token; 
    res.redirect(url);
  });
  
});

module.exports = router;
