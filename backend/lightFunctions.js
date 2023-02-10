const { json } = require("express");
var express = require("express");

function getLights() {
  var goveeKey = require("./apiKeys").getKey('govee');

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
