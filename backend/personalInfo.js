var parsedFields = require("dotenv").config({
  path: "./personalInfo.env",
}).parsed;

module.exports = { parsedFields};