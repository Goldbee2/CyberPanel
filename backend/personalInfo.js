/**
 * Loads backend/personalInfo.env (path is relative to the process cwd, usually the backend folder).
 *
 * Expected keys (used by geoData.js for OpenWeather zip geocoding):
 *   ZIP_CODE       — postal / ZIP code for your location
 *   COUNTRY_CODE   — ISO 3166-1 alpha-2 country code (e.g. US)
 *
 * Example:
 *   ZIP_CODE=12345
 *   COUNTRY_CODE=US
 */
var parsedFields = require("dotenv").config({
  path: "./personalInfo.env",
}).parsed;

module.exports = { parsedFields};