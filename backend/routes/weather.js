var apiKeys = require('../apiKeys')
var express = require("express");
var router = express.Router();





router.get("/", function(req, res, next){
    res.send(apiKeys.getKey('weather'));
})


module.exports = router;