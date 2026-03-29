import * as geoData from "../geoData";
import * as apiKeys from "../apiKeys";

const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";
const AIR_POLLUTION_URL = "https://api.openweathermap.org/data/2.5/air_pollution";

const AQI_LABELS: Record<number, string> = {
  1: "Good",
  2: "Fair",
  3: "Moderate",
  4: "Poor",
  5: "Very poor",
};

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

/** One calendar day of forecast (from 3-hour `/forecast` list). */
export type WeatherDailyForecast = {
  dateKey: string;
  weekday: string;
  tempMin: number;
  tempMax: number;
  /** Short condition text (title case). */
  description: string;
};

export type WeatherAirQuality = {
  aqi: number;
  label: string;
};

export type WeatherApiSuccess = OpenWeatherCurrentResponse & {
  units: "imperial";
  geoLocation?: GeoLocationMeta;
  /** Up to 5 local days aggregated from 3-hour forecast. */
  forecast?: WeatherDailyForecast[];
  airQuality?: WeatherAirQuality | null;
  /** ISO timestamp when the backend finished assembling this payload. */
  fetchedAt?: string;
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

type ForecastListItem = {
  dt: number;
  main: { temp: number; temp_min?: number; temp_max?: number };
  weather: Array<{ icon?: string; main?: string; description?: string }>;
};

type ForecastApiBody = {
  list?: ForecastListItem[];
};

type AirPollutionBody = {
  list?: Array<{ main?: { aqi?: number }; dt?: number }>;
};

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Local calendar date key at `timezone` offset (seconds from UTC, OpenWeather). */
function dayKeyLocal(dtUtc: number, timezoneSec: number): string {
  const u = new Date((dtUtc + timezoneSec) * 1000);
  return `${u.getUTCFullYear()}-${pad2(u.getUTCMonth() + 1)}-${pad2(u.getUTCDate())}`;
}

function weekdayShortLocal(dtUtc: number, timezoneSec: number): string {
  const u = new Date((dtUtc + timezoneSec) * 1000);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[u.getUTCDay()] ?? "";
}

function titleCaseWords(s: string): string {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function descriptionFromWeatherSlot(
  w: { description?: string; main?: string } | undefined
): string {
  if (!w) return "";
  const raw =
    typeof w.description === "string" && w.description.trim()
      ? w.description.trim()
      : typeof w.main === "string" && w.main.trim()
        ? w.main.trim()
        : "";
  return raw ? titleCaseWords(raw) : "";
}

type DayAgg = {
  min: number;
  max: number;
  firstDt: number;
  entries: ForecastListItem[];
};

function mergeCurrentIntoForecastDays(
  days: WeatherDailyForecast[],
  current: OpenWeatherCurrentResponse,
  timezoneSec: number
): WeatherDailyForecast[] {
  const dt = current.dt;
  if (typeof dt !== "number" || !Number.isFinite(dt)) return days;

  const todayKey = dayKeyLocal(dt, timezoneSec);
  const w0 = current.weather?.[0];
  const todayDesc = descriptionFromWeatherSlot(w0);

  const tc = current.main?.temp;
  const curLo =
    typeof current.main?.temp_min === "number" &&
    Number.isFinite(current.main.temp_min)
      ? current.main.temp_min
      : tc;
  const curHi =
    typeof current.main?.temp_max === "number" &&
    Number.isFinite(current.main.temp_max)
      ? current.main.temp_max
      : tc;

  const idx = days.findIndex((d) => d.dateKey === todayKey);
  if (
    idx >= 0 &&
    typeof curLo === "number" &&
    typeof curHi === "number" &&
    Number.isFinite(curLo) &&
    Number.isFinite(curHi)
  ) {
    const d = days[idx];
    d.tempMin = Math.round(Math.min(d.tempMin, curLo));
    d.tempMax = Math.round(Math.max(d.tempMax, curHi));
    if (todayDesc) d.description = todayDesc;
    return days;
  }

  if (
    typeof curLo === "number" &&
    typeof curHi === "number" &&
    Number.isFinite(curLo) &&
    Number.isFinite(curHi)
  ) {
    const desc = todayDesc || "Conditions";
    const prepend: WeatherDailyForecast = {
      dateKey: todayKey,
      weekday: weekdayShortLocal(dt, timezoneSec),
      tempMin: Math.round(Math.min(curLo, typeof tc === "number" ? tc : curLo)),
      tempMax: Math.round(Math.max(curHi, typeof tc === "number" ? tc : curHi)),
      description: desc,
    };
    return [prepend, ...days].slice(0, 5);
  }

  return days;
}

function forecastFallbackFromCurrent(
  current: OpenWeatherCurrentResponse,
  timezoneSec: number
): WeatherDailyForecast[] | undefined {
  const dt = current.dt;
  if (typeof dt !== "number" || !Number.isFinite(dt)) return undefined;

  const w0 = current.weather?.[0];
  const desc = descriptionFromWeatherSlot(w0);
  if (!desc) return undefined;

  const tc = current.main?.temp;
  const curLo =
    typeof current.main?.temp_min === "number" ? current.main.temp_min : tc;
  const curHi =
    typeof current.main?.temp_max === "number" ? current.main.temp_max : tc;
  if (
    typeof curLo !== "number" ||
    typeof curHi !== "number" ||
    !Number.isFinite(curLo) ||
    !Number.isFinite(curHi)
  ) {
    return undefined;
  }

  return [
    {
      dateKey: dayKeyLocal(dt, timezoneSec),
      weekday: weekdayShortLocal(dt, timezoneSec),
      tempMin: Math.round(curLo),
      tempMax: Math.round(curHi),
      description: desc,
    },
  ];
}

function aggregateForecastDaily(
  list: ForecastListItem[] | undefined,
  timezoneSec: number | undefined,
  current: OpenWeatherCurrentResponse
): WeatherDailyForecast[] | undefined {
  if (timezoneSec == null || !Number.isFinite(timezoneSec)) {
    return undefined;
  }

  if (!list?.length) {
    return forecastFallbackFromCurrent(current, timezoneSec);
  }

  const byDay = new Map<string, DayAgg>();
  for (const item of list) {
    if (typeof item.dt !== "number" || !Number.isFinite(item.dt)) continue;
    const key = dayKeyLocal(item.dt, timezoneSec);
    const t = item.main?.temp;
    if (typeof t !== "number" || !Number.isFinite(t)) continue;
    const tMin = item.main?.temp_min;
    const tMax = item.main?.temp_max;
    const lo = typeof tMin === "number" && Number.isFinite(tMin) ? tMin : t;
    const hi = typeof tMax === "number" && Number.isFinite(tMax) ? tMax : t;

    let agg = byDay.get(key);
    if (!agg) {
      agg = { min: lo, max: hi, firstDt: item.dt, entries: [] };
      byDay.set(key, agg);
    } else {
      agg.min = Math.min(agg.min, lo);
      agg.max = Math.max(agg.max, hi);
      if (item.dt < agg.firstDt) agg.firstDt = item.dt;
    }
    agg.entries.push(item);
  }

  const sortedKeys = [...byDay.keys()].sort();
  const out: WeatherDailyForecast[] = [];
  for (const dateKey of sortedKeys.slice(0, 5)) {
    const agg = byDay.get(dateKey);
    if (!agg) continue;
    let pick = agg.entries[0];
    let bestDist = Infinity;
    for (const e of agg.entries) {
      const u = new Date((e.dt + timezoneSec) * 1000);
      const hour = u.getUTCHours() + u.getUTCMinutes() / 60;
      const dist = Math.abs(hour - 12);
      if (dist < bestDist) {
        bestDist = dist;
        pick = e;
      }
    }
    const desc =
      descriptionFromWeatherSlot(pick.weather?.[0]) || "Conditions";
    out.push({
      dateKey,
      weekday: weekdayShortLocal(agg.firstDt, timezoneSec),
      tempMin: Math.round(agg.min),
      tempMax: Math.round(agg.max),
      description: desc,
    });
  }

  if (!out.length) {
    return forecastFallbackFromCurrent(current, timezoneSec);
  }

  return mergeCurrentIntoForecastDays(out, current, timezoneSec);
}

function parseAirQuality(body: unknown): WeatherAirQuality | null {
  if (!body || typeof body !== "object") return null;
  const list = (body as AirPollutionBody).list;
  const first = list?.[0];
  const aqi = first?.main?.aqi;
  if (typeof aqi !== "number" || !Number.isFinite(aqi) || aqi < 1 || aqi > 5) {
    return null;
  }
  return { aqi, label: AQI_LABELS[aqi] ?? String(aqi) };
}

async function fetchOpenWeatherJson(url: URL): Promise<unknown | null> {
  try {
    const response = await fetch(url);
    const text = await response.text();
    if (!response.ok) return null;
    if (!text) return null;
    try {
      return JSON.parse(text) as unknown;
    } catch {
      return null;
    }
  } catch {
    return null;
  }
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

  const currentUrl = new URL(WEATHER_URL);
  currentUrl.searchParams.set("lat", String(lat));
  currentUrl.searchParams.set("lon", String(lon));
  currentUrl.searchParams.set("appid", key);
  currentUrl.searchParams.set("units", "imperial");

  const forecastUrl = new URL(FORECAST_URL);
  forecastUrl.searchParams.set("lat", String(lat));
  forecastUrl.searchParams.set("lon", String(lon));
  forecastUrl.searchParams.set("appid", key);
  forecastUrl.searchParams.set("units", "imperial");

  const airUrl = new URL(AIR_POLLUTION_URL);
  airUrl.searchParams.set("lat", String(lat));
  airUrl.searchParams.set("lon", String(lon));
  airUrl.searchParams.set("appid", key);

  try {
    const [currentRes, forecastRaw, airRaw] = await Promise.all([
      fetch(currentUrl),
      fetchOpenWeatherJson(forecastUrl),
      fetchOpenWeatherJson(airUrl),
    ]);

    const currentText = await currentRes.text();
    let currentBody: unknown = {};
    if (currentText) {
      try {
        currentBody = JSON.parse(currentText) as unknown;
      } catch {
        return {
          error: `Weather API returned invalid JSON (HTTP ${currentRes.status}).`,
        };
      }
    }

    if (!currentRes.ok) {
      const errBody = currentBody as WeatherApiErrorJson;
      const message =
        (typeof errBody.message === "string" && errBody.message) ||
        (errBody.cod != null && String(errBody.cod)) ||
        `Weather request failed (HTTP ${currentRes.status}).`;
      return { error: message };
    }

    const current = currentBody as OpenWeatherCurrentResponse;
    const tz =
      typeof current.timezone === "number" && Number.isFinite(current.timezone)
        ? current.timezone
        : undefined;
    const forecastList = (forecastRaw as ForecastApiBody | null)?.list;
    const forecast =
      tz != null ? aggregateForecastDaily(forecastList, tz, current) : undefined;
    const airQuality = parseAirQuality(airRaw);

    return {
      ...current,
      units: "imperial",
      ...(geoLocation ? { geoLocation } : {}),
      ...(forecast ? { forecast } : {}),
      airQuality: airQuality ?? null,
      fetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error("Weather fetch error:", err);
    return {
      error: errorMessageFromUnknown(err, "Weather request failed."),
    };
  }
}
