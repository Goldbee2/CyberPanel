const OPENWEATHER_ICON_BASE = "https://openweathermap.org/img/wn";

const API_BASE = (
  process.env.REACT_APP_API_BASE_URL || "https://localhost:9000"
).replace(/\/$/, "");

/**
 * Files in `backend/public/` (Express `express.static`). Same base as API calls.
 */
export function backendPublicAsset(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${p}`;
}

/**
 * Files in `frontend/public/` (CRA static files, same host as the UI).
 */
export function craPublicAsset(path: string): string {
  const base = (process.env.PUBLIC_URL || "").replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

const stormClouds = backendPublicAsset("/weather-icons/storm-clouds.webp");
const partlyCloudy = backendPublicAsset("/weather-icons/partly-cloudy.webp");

/**
 * Custom icons keyed by OpenWeather `weather[].icon` (e.g. `10d`, `01n`).
 * Use `backendPublicAsset("/weather-icons/…")` or `craPublicAsset("/weather-icons/…")` depending
 * where the file lives (`backend/public` vs `frontend/public`).
 */
export const customWeatherIconUrls: Partial<Record<string, string>> = {
  // "10d": "/weather-icons/10d.png",
  "04d": stormClouds,
  "04n": stormClouds,
  "02d": partlyCloudy,
  "02n": partlyCloudy,
};

export function openWeatherIconUrl(
  icon: string,
  size: "@2x" | "@4x" = "@4x"
): string {
  return `${OPENWEATHER_ICON_BASE}/${icon}${size}.png`;
}

/** Uses a custom URL when listed in `customWeatherIconUrls`; otherwise OpenWeather CDN. */
export function resolveWeatherIconUrl(
  icon: string,
  size: "@2x" | "@4x" = "@4x"
): string {
  const custom = customWeatherIconUrls[icon];
  if (custom) return custom;
  return openWeatherIconUrl(icon, size);
}
