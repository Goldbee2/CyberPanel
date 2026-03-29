import * as geoData from "../geoData";
import * as apiKeys from "../apiKeys";

const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";

/** Geocoding metadata merged into the API response for display (configured ZIP lookup). */
export type GeoLocationMeta = {
  name?: string;
  country?: string;
  zip?: string;
};

/**
 * OpenWeather “current weather” JSON (2.5) — fields the app may use;
 * see https://openweathermap.org/current
 */
export interface OpenWeatherCurrentResponse {
  weather: Array<{
    id?: number;
    main: string;
    description?: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like?: number;
    temp_min?: number;
    temp_max?: number;
    pressure?: number;
    humidity?: number;
    sea_level?: number;
    grnd_level?: number;
  };
  wind?: { speed?: number; deg?: number; gust?: number };
  visibility?: number;
  clouds?: { all?: number };
  sys?: {
    type?: number;
    id?: number;
    country?: string;
    sunrise?: number;
    sunset?: number;
  };
  coord?: { lon: number; lat: number };
  name?: string;
  dt?: number;
  timezone?: number;
  id?: number;
  cod?: number;
  [key: string]: unknown;
}

export type WeatherApiSuccess = OpenWeatherCurrentResponse & {
  units: "imperial";
  geoLocation?: GeoLocationMeta;
};

type WeatherApiErrorJson = {
  cod?: string | number;
  message?: string;
};

export type WeatherFetchResult = WeatherApiSuccess | { error: string };

function isValidLatLon(lat: unknown, lon: unknown): boolean {
  return (
    typeof lat === "number" &&
    typeof lon === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180
  );
}

function weatherApiKeyConfigured(key: string): boolean {
  return Boolean(key && key !== "ERROR_KEY_NOT_FOUND");
}

function errorMessageFromUnknown(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message;
  return fallback;
}

function messageFromGeoError(apiErr: geoData.GeoApiErrorBody): string {
  if (typeof apiErr.message === "string" && apiErr.message) {
    return apiErr.message;
  }
  if (apiErr.cod != null) return String(apiErr.cod);
  return "Geocoding failed.";
}

function geoMetaFromCoords(coords: geoData.GeoCoords): GeoLocationMeta | undefined {
  const meta: GeoLocationMeta = {};
  if (coords.name != null && String(coords.name)) meta.name = String(coords.name);
  if (coords.country != null && String(coords.country))
    meta.country = String(coords.country);
  if (coords.zip != null && String(coords.zip)) meta.zip = String(coords.zip);
  return Object.keys(meta).length ? meta : undefined;
}

/**
 * Fetches current weather for the configured location (via geoData).
 * On failure returns { error: string }; on success returns OpenWeather JSON plus `units` and optional `geoLocation`.
 */
export async function fetchWeatherData(): Promise<WeatherFetchResult> {
  const key = apiKeys.getKey("weather");
  if (!weatherApiKeyConfigured(key)) {
    return { error: "Weather API key is not configured." };
  }

  let geoResult: geoData.GeocodingResult;
  try {
    geoResult = await geoData.getData();
  } catch (err) {
    console.error("Geocoding request failed:", err);
    return {
      error: errorMessageFromUnknown(err, "Failed to resolve location."),
    };
  }

  if ("error" in geoResult && geoResult.error) {
    return { error: messageFromGeoError(geoResult.error) };
  }

  const { lat, lon } = geoResult.response;
  if (!isValidLatLon(lat, lon)) {
    return { error: "Invalid coordinates from geocoding response." };
  }

  const geoLocation = geoMetaFromCoords(geoResult.response);

  const url = new URL(WEATHER_URL);
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lon));
  url.searchParams.set("appid", key);
  url.searchParams.set("units", "imperial");

  try {
    const response = await fetch(url);
    const text = await response.text();

    let body: unknown = {};
    if (text) {
      try {
        body = JSON.parse(text) as unknown;
      } catch {
        return {
          error: `Weather API returned invalid JSON (HTTP ${response.status}).`,
        };
      }
    }

    if (!response.ok) {
      const errBody = body as WeatherApiErrorJson;
      const message =
        (typeof errBody.message === "string" && errBody.message) ||
        (errBody.cod != null && String(errBody.cod)) ||
        `Weather request failed (HTTP ${response.status}).`;
      return { error: message };
    }

    const current = body as OpenWeatherCurrentResponse;
    return {
      ...current,
      units: "imperial",
      ...(geoLocation ? { geoLocation } : {}),
    };
  } catch (err) {
    console.error("Weather fetch error:", err);
    return {
      error: errorMessageFromUnknown(err, "Weather request failed."),
    };
  }
}
