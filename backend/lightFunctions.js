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

function invalidateDeviceListCache() {
  cachedPayload = null;
  cacheExpiresAt = 0;
}

/**
 * @param {{ device: string; model: string; on: boolean }} params
 * @returns {Promise<{ ok: boolean; status: number; json: object }>}
 */
function setLightPower({ device, model, on }) {
  const goveeKey = require("./apiKeys").getKey("govee");
  const body = {
    device,
    model,
    cmd: { name: "turn", value: on ? "on" : "off" },
  };
  return fetch("https://developer-api.govee.com/v1/devices/control", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Govee-Api-Key": goveeKey,
    },
    body: JSON.stringify(body),
  })
    .then(async (res) => {
      let json = {};
      try {
        json = await res.json();
      } catch (_) {
        /* non-JSON body */
      }
      const codeOk =
        json &&
        (json.code === 200 ||
          String(json.message || "").toLowerCase() === "success");
      if (res.ok && codeOk) {
        invalidateDeviceListCache();
      }
      return { ok: Boolean(res.ok && codeOk), status: res.status, json };
    })
    .catch((err) => {
      console.log("Govee control error:", err);
      return {
        ok: false,
        status: 0,
        json: { message: err && err.message ? err.message : "Network error" },
      };
    });
}

module.exports = { getLights, setLightPower };
