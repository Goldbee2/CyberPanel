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
import BracketFrame from "./components/BracketFrame";
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
            <div className="relative isolate min-h-screen overflow-hidden bg-canvas text-ink">
                <div
                    className="pointer-events-none absolute inset-0 z-0 bg-repeat opacity-[0.035] dark:opacity-[0.045]"
                    style={{
                        backgroundImage: `url(${grainSvgUrl})`,
                        backgroundSize: "160px 160px",
                    }}
                    aria-hidden
                />
                <div className="relative z-10 flex min-h-screen flex-col">
                    <div className="flex h-[30px] w-screen items-center justify-between gap-4 px-6 py-0.5">
                        <ServerStatusComponent />
                        <ThemeToggle />
                    </div>
                    <main className="flex w-screen flex-row gap-4 p-4">
                        <div className="w-2/3 flex flex-col gap-4">
                            <BracketFrame
                                className="w-full p-4"
                                contentClassName="flex w-full min-w-0 flex-row items-center justify-between gap-6"
                            >
                                <div className="flex min-w-0 flex-1 flex-col">
                                    <PanelComponent title="Time and Weather">
                                        <ClockSection />
                                        <hr className="border-0.5 border-ink-tertiary opacity-10 my-4" />
                                        <WeatherComponent />
                                    </PanelComponent>
                                </div>
                                <div className="shrink-0 self-center">
                                    <WeatherIcon />
                                </div>
                            </BracketFrame>
                            <BracketFrame className="p-4">
                                <PanelComponent id="to-do-list" title="To Do">
                                    <ToDoList />
                                </PanelComponent>
                            </BracketFrame>
                        </div>
                        <BracketFrame className="w-1/3 p-4">
                            <LightsComponent />
                            <CalendarComponent />
                        </BracketFrame>
                    </main>
                </div>
            </div>
        </WeatherProvider>
    );
}
