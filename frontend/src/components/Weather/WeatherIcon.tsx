import React from "react";
import { useWeather } from "./WeatherProvider";
import Error from "../Error";
import { resolveWeatherIconUrl } from "./weatherIconUrls";


export default function WeatherIcon() {
    const { weather, loading, error } = useWeather();
    if (error) {
        return <Error />;
    }
    if (loading || !weather) {
        return <p className="text-ink-tertiary">Loading...</p>;
    }
    const icon = weather.weather[0].icon;
    return (
        <img
            src={resolveWeatherIconUrl(icon)}
            alt={icon}
            className="h-auto w-auto max-h-[min(15rem,32svh)] max-w-[min(15rem,42vw)] shrink-0 object-contain"
        />
    );
}
