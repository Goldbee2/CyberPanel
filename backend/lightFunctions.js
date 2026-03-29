/** How long to reuse the Govee device list before refreshing (ms). */
const DEVICE_LIST_CACHE_TTL_MS = 60_000;

let cachedPayload = null;
let cacheExpiresAt = 0;
let inFlight = null;

function getLights() {
  const now = Date.now();
  if (cachedPayload != null && now < cacheExpiresAt) {
    return Promise.resolve(cachedPayload);
  }
  if (inFlight) {
    return inFlight;
  }

  var goveeKey = require("./apiKeys").getKey("govee");

  inFlight = fetch("https://developer-api.govee.com/v1/devices", {
    headers: [["Govee-Api-Key", goveeKey]],
  })
    .then(async (res) => {
      const json = await res.json();
      if (res.ok) {
        cachedPayload = json;
        cacheExpiresAt = Date.now() + DEVICE_LIST_CACHE_TTL_MS;
      }
      return json;
    })
    .catch((err) => {
      console.log("Fetch error:", err);
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

module.exports = { getLights };
