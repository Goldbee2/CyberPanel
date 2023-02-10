var express = require("express");
var router = express.Router();
var oauth2 = require("../oAuth2");

router.get("/getRedirect", function (req, res, next) {
  let a = oauth2.getRedirectURL();
  res.send(a);
//   a.then((b) => {
//     console.log(b);
//     res.send(b);
//   });
//   res.setHeader("content-type", "application/json");
});



module.exports = router;
