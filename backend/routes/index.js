var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Want to know what this does?",
    description: "Go to http://github.com/goldbee2/CyberPanel.",
  });
});

module.exports = router;
