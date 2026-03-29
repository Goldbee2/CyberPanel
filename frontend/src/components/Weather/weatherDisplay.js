/** @param {number | undefined} deg */
export function windDirectionLabel(deg) {
  if (typeof deg !== "number" || !Number.isFinite(deg)) return null;
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const i = Math.round(deg / 45) % 8;
  return dirs[i];
}

/** @param {number | undefined} meters */
export function visibilityToMiles(meters) {
  if (typeof meters !== "number" || !Number.isFinite(meters) || meters <= 0) {
    return null;
  }
  const mi = meters / 1609.34;
  return mi >= 10 ? Math.round(mi) : Math.round(mi * 10) / 10;
}

/** @param {number | undefined} unixSec */
export function formatSunTime(unixSec) {
  if (typeof unixSec !== "number" || !Number.isFinite(unixSec)) return null;
  return new Date(unixSec * 1000).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
