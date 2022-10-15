const { json } = require("express");
var express = require("express");

function getLights() {
  // var goveeKey = require("./apiKeys").getKey('govee');
  var goveeKey = "de4f1a25-148c-4437-81fc-fc13328edc83";

  return fetch("https://developer-api.govee.com/v1/devices", {
    headers: [["Govee-Api-Key", goveeKey]],
  })
    .then((res) => {
      return res;
    }).then((res2)=>{return res2.json()})
    .catch((err) => {
      console.log("Fetch error:", err);
    });
}

module.exports = { getLights };
