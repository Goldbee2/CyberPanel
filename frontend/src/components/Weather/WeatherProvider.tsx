import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type WeatherGeoLocation = {
  name?: string;
  country?: string;
  zip?: string;
};

/** Successful `/weather` payload (OpenWeather current + `units` + optional `geoLocation`). */
export type WeatherData = {
  weather: Array<{
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
  };
  wind?: { speed?: number; deg?: number };
  visibility?: number;
  clouds?: { all?: number };
  sys?: { sunrise?: number; sunset?: number; country?: string };
  name?: string;
  dt?: number;
  timezone?: number;
  geoLocation?: WeatherGeoLocation;
  units?: string;
};

type WeatherContextValue = {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

const WeatherContext = createContext<WeatherContextValue | undefined>(
  undefined
);

const backendOrigin = (
  process.env.REACT_APP_API_BASE_URL || "https://localhost:9000"
).replace(/\/$/, "");

function isWeatherSuccess(parsed: unknown): parsed is WeatherData {
  if (!parsed || typeof parsed !== "object") return false;
  const p = parsed as Record<string, unknown>;
  if (typeof p.error === "string") return false;
  if (!Array.isArray(p.weather) || p.weather.length === 0) return false;
  const w0 = p.weather[0] as Record<string, unknown>;
  if (typeof w0?.main !== "string" || typeof w0?.icon !== "string")
    return false;
  const main = p.main as Record<string, unknown> | undefined;
  if (!main || typeof main.temp !== "number" || !Number.isFinite(main.temp))
    return false;
  return true;
}

export function useWeather(): WeatherContextValue {
  const ctx = useContext(WeatherContext);
  if (!ctx) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return ctx;
}

export default function WeatherProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);

    fetch(`${backendOrigin}/weather`)
      .then((res) => res.json())
      .then((parsed: unknown) => {
        if (
          typeof parsed === "object" &&
          parsed !== null &&
          "error" in parsed
        ) {
          const err = (parsed as { error?: unknown }).error;
          if (typeof err === "string" && err) {
            setWeather(null);
            setError(err);
            return;
          }
        }
        if (!isWeatherSuccess(parsed)) {
          setWeather(null);
          setError("Weather data unavailable.");
          return;
        }
        setWeather(parsed);
        setError(null);
      })
      .catch(() => {
        setWeather(null);
        setError("Weather request failed.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const value = useMemo(
    () => ({
      weather,
      loading,
      error,
      refetch: load,
    }),
    [weather, loading, error, load]
  );

  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  );
}
