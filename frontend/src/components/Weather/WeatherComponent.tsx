import React from "react";
import Error from "../Error.js";
import { useWeather } from "./WeatherProvider";
import { windDirectionLabel } from "./weatherDisplay.js";

function WeatherComponent() {
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
        <div className="flex flex-row items-center gap-6">
            <h2 className="text-ink text-5xl font-display">
                {currentTemp}&#176;
            </h2>

            <div className="flex h-fit flex-col self-center text-xl [&_*]:m-0 [&_*]:text-left">
                <p className="text-ink-secondary text-xl font-display">
                    {titleCase}
                </p>
                {detailParts.length > 0 ? (
                    <div className="flex flex-row gap-6">
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

function DetailPart({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-1">
            <p className="text-xs leading-snug text-ink-tertiary opacity-50">
                {label}
            </p>
            <p className="text-sm leading-snug text-ink-tertiary">{value}</p>
        </div>
    );
}

export default WeatherComponent;
