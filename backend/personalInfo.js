var parsedFields = require("dotenv").config({
  path: "./backend/personalInfo.env",
}).parsed;

module.exports = { parsedFields};