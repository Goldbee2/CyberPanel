import React from "react";
import ClockSection from "./components/ClockComponent";
import LightsComponent from "./components/LightsComponent";
import CalendarComponent from "./components/CalendarComponent";
import ToDoList from "./components/ToDoListComponent";
import AuthRedirect from "./AuthRedirect";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PanelComponent from "./components/PanelComponent";
import WeatherComponent from "./components/Weather/WeatherComponent";
import WeatherProvider from "./components/Weather/WeatherProvider.tsx";
import ServerStatusComponent from "./components/ServerStatusComponent";
import { useTheme } from "./components/Theme/ThemeProvider";
import WeatherIcon from "./components/Weather/WeatherIcon.tsx";
import grainSvgUrl from "./assets/noise.svg";

function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="text-xs text-ink-secondary transition-colors hover:text-ink"
        >
            {theme === "dark" ? "Light" : "Dark"}
        </button>
    );
}

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/authRedirect" element={<AuthRedirect />} />
            </Routes>
        </Router>
    );
}

function Main() {
    return (
        <WeatherProvider>
            <div className="relative isolate flex h-svh max-h-svh flex-col overflow-hidden bg-canvas text-ink">
                <div
                    className="pointer-events-none absolute inset-0 z-0 bg-repeat opacity-[0.035] dark:opacity-[0.045]"
                    style={{
                        backgroundImage: `url(${grainSvgUrl})`,
                        backgroundSize: "400px 400px",
                    }}
                    aria-hidden
                />
                <div className="relative z-10 flex min-h-0 flex-1 flex-col">
                    <div className="flex h-[30px] w-full shrink-0 items-center justify-between gap-4 px-6 py-0.5">
                        <ServerStatusComponent />
                        <ThemeToggle />
                    </div>
                    <main className="flex min-h-0 min-w-0 flex-1 flex-row gap-4 p-4">
                        <div className="flex min-h-0 w-2/3 min-w-0 flex-col gap-4">
                            <div className="flex min-w-0 shrink-0 items-stretch gap-6">
                                <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                                    <PanelComponent
                                        title="Time and Weather"
                                        className="flex h-full min-h-0 flex-col"
                                    >
                                        <ClockSection />
                                        <hr className="my-4 border-0.5 border-ink-tertiary opacity-10" />
                                        <WeatherComponent />
                                    </PanelComponent>
                                </div>
                                <div className="box-border flex min-h-0 shrink-0 flex-col self-stretch border border-solid border-subtle-accent p-5">
                                    <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
                                        <WeatherIcon />
                                    </div>
                                </div>
                            </div>
                            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                                <PanelComponent
                                    id="to-do-list"
                                    title="To Do"
                                    className="flex h-full min-h-0 flex-col"
                                >
                                    <ToDoList />
                                </PanelComponent>
                            </div>
                        </div>
                        <div className="flex min-h-0 w-1/3 min-w-0 flex-col gap-4">
                            <div className="shrink-0">
                                <LightsComponent />
                            </div>
                            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                                <CalendarComponent />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </WeatherProvider>
    );
}
