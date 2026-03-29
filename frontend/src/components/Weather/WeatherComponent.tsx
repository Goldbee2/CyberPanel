import React from "react";
import Error from "../Error.js";
import { useWeather } from "./WeatherProvider";
import { windDirectionLabel } from "./weatherDisplay.js";

function pad2(n: number): string {
    return String(n).padStart(2, "0");
}

/** Same local calendar key as backend (`timezone` = OpenWeather seconds offset). */
function localDateKeyFromUtc(dtUtc: number, timezoneSec: number): string {
    const u = new Date((dtUtc + timezoneSec) * 1000);
    return `${u.getUTCFullYear()}-${pad2(u.getUTCMonth() + 1)}-${pad2(u.getUTCDate())}`;
}

function nextCalendarDateKey(dateKey: string): string {
    const [y, m, d] = dateKey.split("-").map(Number);
    const next = new Date(Date.UTC(y, m - 1, d + 1));
    return `${next.getUTCFullYear()}-${pad2(next.getUTCMonth() + 1)}-${pad2(next.getUTCDate())}`;
}

function dayOutlookLabel(
    dateKey: string,
    todayKey: string | null,
    fallbackWeekday: string
): string {
    if (todayKey && dateKey === todayKey) return "Today";
    if (todayKey && dateKey === nextCalendarDateKey(todayKey)) return "Tomorrow";
    return fallbackWeekday;
}

function formatLocationTime(
    unixUtcSeconds: number,
    timezoneOffsetSec: number
): string {
    const d = new Date((unixUtcSeconds + timezoneOffsetSec) * 1000);
    const h = d.getUTCHours();
    const m = d.getUTCMinutes();
    const h12 = h % 12 || 12;
    const ampm = h >= 12 ? "PM" : "AM";
    return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

/** Current temp + condition + feels / wind / humidity (top block beside icon). */
export function WeatherCurrentSection() {
    const { weather, loading, error } = useWeather();

    if (error) {
        return <Error />;
    }

    if (loading || !weather) {
        return <p className="text-ink-tertiary">Loading...</p>;
    }

    const currentWeather = weather.weather[0];
    const rawLabel = (
        currentWeather.description || currentWeather.main
    ).toLowerCase();
    const titleCase = rawLabel.replace(/\b\w/g, (c) => c.toUpperCase());
    const currentTemp = Math.round(weather.main.temp);
    const feels = weather.main.feels_like;
    const humidity = weather.main.humidity;
    const windSpeed = weather.wind?.speed;
    const windDeg = windDirectionLabel(weather.wind?.deg);
    const units = weather.units;

    const detailParts: { label: string; value: string }[] = [];
    if (typeof feels === "number" && Number.isFinite(feels)) {
        const feelsWithUnit =
            units === "metric"
                ? `${Math.round(feels)}°C`
                : units === "standard"
                  ? `${Math.round(feels)} K`
                  : `${Math.round(feels)}°F`;
        detailParts.push({
            label: "FEELS LIKE",
            value: feelsWithUnit,
        });
    }
    if (typeof humidity === "number" && Number.isFinite(humidity)) {
        detailParts.push({
            label: "HUMIDITY",
            value: `${Math.round(humidity)}%`,
        });
    }
    if (typeof windSpeed === "number" && Number.isFinite(windSpeed)) {
        const windUnit =
            units === "metric" || units === "standard" ? "m/s" : "mph";
        const dir = windDeg ? ` ${windDeg}` : "";
        detailParts.push({
            label: "WIND",
            value: `${Math.round(windSpeed)} ${windUnit}${dir}`,
        });
    }

    return (
        <div className="flex min-w-0 flex-row items-center gap-6">
            <h2 className="text-ink text-[4rem] font-display">
                {currentTemp}&#176;
            </h2>

            <div className="flex h-fit min-w-0 flex-col gap-4 self-center text-xl [&_*]:m-0 [&_*]:text-left">
                <p className="text-ink-secondary text-xl font-display">
                    {titleCase}
                </p>
                {detailParts.length > 0 ? (
                    <div className="flex flex-row flex-wrap gap-x-6 gap-y-2">
                        {detailParts.map((part) => (
                            <DetailPart
                                key={part.label}
                                label={part.label}
                                value={part.value}
                            />
                        ))}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

/** 5-day outlook (horizontal) + sunrise / pressure / last updated row. */
export function WeatherSecondarySection() {
    const { weather, loading, error } = useWeather();

    if (error || loading || !weather) {
        return null;
    }

    const units = weather.units;
    const tz =
        typeof weather.timezone === "number" && Number.isFinite(weather.timezone)
            ? weather.timezone
            : undefined;
    const sunrise = weather.sys?.sunrise;
    const sunset = weather.sys?.sunset;
    const pressure = weather.main.pressure;
    const aq = weather.airQuality;
    const fetchedAt = weather.fetchedAt;
    const forecast = weather.forecast;

    const todayKey =
        tz != null &&
        typeof weather.dt === "number" &&
        Number.isFinite(weather.dt)
            ? localDateKeyFromUtc(weather.dt, tz)
            : null;

    const bottomLeftParts: { label: string; value: string }[] = [];
    if (
        tz != null &&
        typeof sunrise === "number" &&
        Number.isFinite(sunrise)
    ) {
        bottomLeftParts.push({
            label: "SUNRISE",
            value: formatLocationTime(sunrise, tz),
        });
    }
    if (tz != null && typeof sunset === "number" && Number.isFinite(sunset)) {
        bottomLeftParts.push({
            label: "SUNSET",
            value: formatLocationTime(sunset, tz),
        });
    }
    if (typeof pressure === "number" && Number.isFinite(pressure)) {
        bottomLeftParts.push({
            label: "PRESSURE",
            value: `${Math.round(pressure)} hPa`,
        });
    }
    if (aq && typeof aq.aqi === "number") {
        bottomLeftParts.push({
            label: "AIR (AQI)",
            value: `${aq.label} (${aq.aqi}/5)`,
        });
    }

    let lastUpdatedPart: { label: string; value: string } | null = null;
    if (typeof fetchedAt === "string" && fetchedAt) {
        const t = Date.parse(fetchedAt);
        if (Number.isFinite(t)) {
            lastUpdatedPart = {
                label: "LAST UPDATED",
                value: new Date(t).toLocaleString(undefined, {
                    dateStyle: "short",
                    timeStyle: "short",
                }),
            };
        }
    }

    const hasBottom =
        bottomLeftParts.length > 0 || lastUpdatedPart != null;

    const tempSuffix =
        units === "metric" ? "°C" : units === "standard" ? " K" : "°";

    const hasForecast = forecast && forecast.length > 0;

    if (!hasForecast && !hasBottom) {
        return null;
    }

    return (
        <div className="min-w-0">
            <hr className="my-4 border-0.5 border-ink-tertiary opacity-10" />
            <div className="flex min-w-0 flex-col gap-4">
            {hasForecast ? (
                <div className="min-w-0 pt-4">
                    <ul className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-5">
                        {forecast!.map((day) => (
                            <li
                                key={day.dateKey}
                                className="flex min-w-0 flex-col gap-1"
                            >
                                <span className="text-xs font-mono tracking-wide text-ink-tertiary opacity-50">
                                    {dayOutlookLabel(
                                        day.dateKey,
                                        todayKey,
                                        day.weekday
                                    ).toUpperCase()}
                                </span>
                                <div className="flex items-baseline gap-1.5 tabular-nums">
                                    <span className="text-base font-semibold text-ink">
                                        {day.tempMax}
                                        {tempSuffix}
                                    </span>
                                    <span className="text-xs font-normal text-ink-tertiary opacity-70">
                                        {day.tempMin}
                                        {tempSuffix}
                                    </span>
                                </div>
                                <p className="line-clamp-2 text-[0.65rem] leading-snug text-ink-tertiary uppercase tracking-wide opacity-70">
                                    {day.description}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}

            {hasForecast && hasBottom ? (
                <hr className="my-4 border-0.5 border-ink-tertiary opacity-10" />
            ) : null}

            {hasBottom ? (
                <div
                    className={
                        "flex min-w-0 flex-row flex-wrap items-end gap-x-6 gap-y-3 " +
                        (bottomLeftParts.length > 0 && lastUpdatedPart
                            ? "justify-between"
                            : lastUpdatedPart && bottomLeftParts.length === 0
                              ? "justify-end"
                              : "")
                    }
                >
                    {bottomLeftParts.length > 0 ? (
                        <div className="flex min-w-0 flex-1 flex-row flex-wrap gap-x-8 gap-y-2">
                            {bottomLeftParts.map((part) => (
                                <DetailPart
                                    key={part.label}
                                    label={part.label}
                                    value={part.value}
                                />
                            ))}
                        </div>
                    ) : null}
                    {lastUpdatedPart ? (
                        <div className="shrink-0 text-right">
                            <DetailPart
                                label={lastUpdatedPart.label}
                                value={lastUpdatedPart.value}
                                align="end"
                            />
                        </div>
                    ) : null}
                </div>
            ) : null}
            </div>
        </div>
    );
}

function DetailPart({
    label,
    value,
    align,
}: {
    label: string;
    value: string;
    align?: "start" | "end";
}) {
    const alignClass = align === "end" ? "items-end text-right" : "";
    return (
        <div className={`flex flex-col gap-2 ${alignClass}`}>
            <p className="text-xs leading-none font-mono tracking-wide text-ink-tertiary opacity-50">
                {label}
            </p>
            <p className="text-sm leading-snug text-ink-tertiary">{value}</p>
        </div>
    );
}

export default function WeatherComponent() {
    return (
        <>
            <WeatherCurrentSection />
            <WeatherSecondarySection />
        </>
    );
}
