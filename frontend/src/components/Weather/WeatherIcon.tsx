import React from "react";
import { useWeather } from "./WeatherProvider";
import { resolveWeatherIconUrl } from "./weatherIconUrls";

/** Matches previous standalone icon sizing. */
const iconImgClass =
    "h-auto w-auto max-h-[min(15rem,32svh)] max-w-[min(15rem,42vw)] shrink-0 object-contain";

type WeatherIconProps = {
    /** Used when the icon sits in the time/weather panel (same pixel size as standalone). */
    panelLayout?: boolean;
};

export default function WeatherIcon({ panelLayout }: WeatherIconProps) {
    const { weather, loading, error } = useWeather();
    if (error) {
        return null;
    }
    if (loading || !weather) {
        if (panelLayout) {
            return (
                <div
                    className={`${iconImgClass} rounded-sm bg-ink-tertiary/5`}
                    aria-hidden
                />
            );
        }
        return null;
    }
    const icon = weather.weather[0].icon;
    return (
        <img
            src={resolveWeatherIconUrl(icon)}
            alt=""
            className={iconImgClass}
        />
    );
}
